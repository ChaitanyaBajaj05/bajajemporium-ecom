from rest_framework import serializers
from .models import Brand, Product, ProductImage, Category, Review, ProductType, Color


class BrandSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(read_only=True)

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo']


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image']

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'slug']


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']


class ProductSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    product_type = ProductTypeSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    available_colors = ColorSerializer(many=True, read_only=True)
    primary_color = ColorSerializer(read_only=True)

    discounted_price = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "description", "price", "discount_percentage", "discounted_price", "image",
            "stock", "brand", "category", "product_type",
            "kurta_fabric", "bottom_fabric", "dupatta_fabric",
            "kurta_length", "bottom_length", "dupatta_length",
            "fabric_type", "work_type", "occasion", "care_instructions",
            "primary_color", "available_colors",
            "sales_count", "is_best_seller", "is_trending", "is_featured",
            "created_at", "images"
        ]

    def get_discounted_price(self, obj):
        if obj.discount_percentage > 0:
            return round(obj.price * (100 - obj.discount_percentage) / 100, 2)
        return obj.price

    def get_image(self, obj):
        request = self.context.get("request")
        image = obj.images.first()
        if image and image.image:
            return request.build_absolute_uri(image.image.url) if request else image.image.url
        return None


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'customer_name', 'rating', 'comment', 'created_at']


class ProductReviewSerializer(ReviewSerializer):
    class Meta(ReviewSerializer.Meta):
        fields = ReviewSerializer.Meta.fields + ['product']
