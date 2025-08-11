# core/serializers.py

from rest_framework import serializers
from .models import CartItem, Cart, Order, OrderItem, WishlistItem
from store.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

    def get_total_price(self, obj):
        price = obj.product.discounted_price if obj.product.discounted_price else obj.product.price
        return price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price']

    def get_total_price(self, obj):
        return sum([
            (item.product.discounted_price if item.product.discounted_price else item.product.price) * item.quantity
            for item in obj.items.all()
        ])


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'total_price']

    def get_total_price(self, obj):
        price = obj.product.discounted_price or obj.product.price
        return price * obj.quantity

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'items', 'total_amount']

    def get_total_amount(self, obj):
        return sum([
            (item.product.discounted_price or item.product.price) * item.quantity
            for item in obj.items.all()
        ])


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']
