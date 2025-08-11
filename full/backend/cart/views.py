from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Cart, CartItem, Order, OrderItem, WishlistItem
from .serializers import (
    CartSerializer, CartItemSerializer,
    OrderSerializer, OrderItemSerializer,
    WishlistItemSerializer
)
from store.models import Product
import logging

logger = logging.getLogger(__name__)

class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Cart.objects.prefetch_related('items__product').all()
    serializer_class = CartSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['GET'])
    def get_cart(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'])
    def add_to_cart(self, request):
        with transaction.atomic():
            product_id = request.data.get('product_id')
            quantity = int(request.data.get('quantity', 1))

            if not product_id:
                return Response({"detail": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                product = Product.objects.select_for_update().get(id=product_id)

                if product.stock < quantity:
                    return Response({"detail": "Insufficient stock"}, status=status.HTTP_400_BAD_REQUEST)

                cart, _ = Cart.objects.get_or_create(user=request.user)
                cart_item, created = CartItem.objects.get_or_create(
                    cart=cart,
                    product=product,
                    defaults={'quantity': quantity}
                )

                if not created:
                    if cart_item.quantity + quantity > product.stock:
                        return Response({"detail": "Exceeds available stock"}, status=status.HTTP_400_BAD_REQUEST)
                    cart_item.quantity += quantity
                    cart_item.save()

                product.stock -= quantity
                product.save()

                return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

            except Product.DoesNotExist:
                return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                logger.error(f"Cart error: {str(e)}", exc_info=True)
                return Response({"detail": "Error processing request"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'])
    def remove_from_cart(self, request):
        with transaction.atomic():
            product_id = request.data.get('product_id')
            quantity = int(request.data.get('quantity', 1))

            try:
                product = Product.objects.select_for_update().get(id=product_id)
                cart = Cart.objects.get(user=request.user)
                cart_item = CartItem.objects.get(cart=cart, product=product)

                if quantity >= cart_item.quantity:
                    product.stock += cart_item.quantity
                    cart_item.delete()
                else:
                    product.stock += quantity
                    cart_item.quantity -= quantity
                    cart_item.save()

                product.save()
                return Response(status=status.HTTP_204_NO_CONTENT)

            except (CartItem.DoesNotExist, Product.DoesNotExist):
                return Response({"detail": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'])
    def clear_cart(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            for item in cart.items.all():
                item.product.stock += item.quantity
                item.product.save()
            cart.items.all().delete()
            return Response({"detail": "Cart cleared"}, status=status.HTTP_200_OK)
        except Cart.DoesNotExist:
            return Response({"detail": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'])
    def update_quantity(self, request):
        try:
            product_id = request.data.get('product_id')
            quantity = int(request.data.get('quantity', 1))

            cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)

            product = cart_item.product
            available_stock = product.stock + cart_item.quantity

            if quantity > available_stock:
                return Response({"detail": "Not enough stock"}, status=status.HTTP_400_BAD_REQUEST)

            # Adjust stock
            product.stock += cart_item.quantity
            product.stock -= quantity
            product.save()

            # Update cart item
            cart_item.quantity = quantity
            cart_item.save()

            return Response(CartItemSerializer(cart_item).data, status=status.HTTP_200_OK)

        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response({"detail": "Cart or item not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Update quantity error: {str(e)}", exc_info=True)
            return Response({"detail": "Error updating quantity"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- Order View ---
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def place_order(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user).first()
        if not cart or cart.items.count() == 0:
            return Response({"detail": "Cart is empty"}, status=400)

        order = Order.objects.create(user=user)
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.discounted_price or item.product.price
            )
        cart.items.all().delete()
        return Response({"success": "Order placed successfully"})

            

# --- Wishlist View ---
class WishlistViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistItemSerializer

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related('product')
    
    def list(self, request):  # 👈 Add this
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"detail": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
            wishlist_item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
            if not created:
                return Response({"detail": "Product already in wishlist"}, status=status.HTTP_200_OK)

            return Response(self.get_serializer(wishlist_item).data, status=status.HTTP_201_CREATED)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
