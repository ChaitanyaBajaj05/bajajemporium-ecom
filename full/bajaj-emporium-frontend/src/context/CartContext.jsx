import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
});

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total_cost: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post(
        `${axiosInstance.defaults.baseURL}/api/auth/token/refresh/`,
        { refresh: refreshToken }
      );
      localStorage.setItem("accessToken", response.data.access);
      return response.data.access;
    } catch (error) {
      localStorage.clear();
      window.location.href = "/login";
      return null;
    }
  }, []);

  const handleError = useCallback((error, defaultMessage) => {
    const errorMessage = error.response?.data?.detail || error.message || defaultMessage;
    setError(errorMessage);

    if (error.response?.status === 401 && retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setTimeout(fetchCart, 1000);
    } else {
      setRetryCount(0);
    }
  }, [retryCount]);

  useEffect(() => {
    const reqInterceptor = axiosInstance.interceptors.request.use(config => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const resInterceptor = axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [refreshToken]);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/cart/get_cart/");
      setCart({
        items: response.data.items || [],
        total_cost: response.data.total_cost || 0
      });
      setRetryCount(0);
    } catch (error) {
      handleError(error, "Failed to load cart");
      setCart({ items: [], total_cost: 0 });
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await axiosInstance.post("/api/cart/add_to_cart/", {
        product_id: productId,
        quantity: Math.max(1, Math.min(quantity, 10))
      });
      fetchCart();
      return true;
    } catch (error) {
      handleError(error, "Failed to add item to cart");
      return false;
    }
  }, [fetchCart, handleError]);

  const removeFromCart = useCallback(async (productId) => {
    try {
      await axiosInstance.post("/api/cart/remove_from_cart/", {
        product_id: productId
      });
      fetchCart();
    } catch (error) {
      handleError(error, "Failed to remove item from cart");
    }
  }, [fetchCart, handleError]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      await axiosInstance.post("/api/cart/update_quantity/", {
        product_id: productId,
        quantity: Math.max(1, Math.min(quantity, 10))
      });
      fetchCart();
    } catch (error) {
      handleError(error, "Failed to update quantity");
    }
  }, [fetchCart, handleError]);

  const clearCart = useCallback(async () => {
    try {
      await axiosInstance.post("/api/cart/clear_cart/");
      setCart({ items: [], total_cost: 0 });
      fetchCart();
    } catch (error) {
      handleError(error, "Failed to clear cart");
    }
  }, [fetchCart, handleError]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart: cart.items,
        totalCost: cart.total_cost,
        loading,
        error,
        retryCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
