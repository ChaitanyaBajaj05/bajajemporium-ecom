from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r'', CartViewSet, basename='cart')  # No 'cart' prefix here
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
    path('get_cart/', CartViewSet.as_view({'get': 'get_cart'}), name='get_cart'),
    path('add_to_cart/', CartViewSet.as_view({'post': 'add_to_cart'}), name='add_to_cart'),
    path('remove_from_cart/', CartViewSet.as_view({'post': 'remove_from_cart'}), name='remove_from_cart'),
    path('clear_cart/', CartViewSet.as_view({'post': 'clear_cart'}), name='clear_cart'),
    path('update_quantity/', CartViewSet.as_view({'post': 'update_quantity'}), name='update_quantity'),
    path('orders/', OrderViewSet.as_view({'get': 'list'})),
    path('orders/place_order/', OrderViewSet.as_view({'post': 'place_order'})),
]
