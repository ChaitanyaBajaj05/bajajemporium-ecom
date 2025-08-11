
from django.contrib import admin
from .models import CartItem, Cart, Order, WishlistItem


admin.site.register(CartItem)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(WishlistItem)
