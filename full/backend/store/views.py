from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Brand, Product, ProductImage,Category,Review
from .serializers import BrandSerializer, ProductSerializer, ProductImageSerializer,CategorySerializer,ReviewSerializer
from django.shortcuts import render
from django.http import JsonResponse
class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Brand, Product, ProductImage,Category
from .serializers import BrandSerializer, ProductSerializer, ProductImageSerializer,CategorySerializer
from .models import Product, Category, ProductType
class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = Product.objects.all().order_by('-created_at')

        # Check for `is_featured=true` in query parameters
        is_featured = self.request.query_params.get("is_featured")
        if is_featured == "true":
            queryset = queryset.filter(is_featured=True)

        return queryset

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

@api_view(['GET'])
def get_trending_products(request):
    """Get trending products"""
    trending_products = Product.objects.filter(is_trending=True)
    serializer = ProductSerializer(trending_products, many=True, context={'request': request})
    return Response(serializer.data)
@api_view(['GET'])
def get_best_sellers(request):
    """Get top 10 best selling products"""
    best_sellers = Product.objects.filter(sales_count__gt=0).order_by('-sales_count')[:10]
    serializer = ProductSerializer(best_sellers, many=True, context={'request': request})
    return Response(serializer.data)
@api_view(['GET'])
def get_featured_products(request):
    """Get featured products"""
    featured_products = Product.objects.filter(is_featured=True)
    serializer = ProductSerializer(featured_products, many=True, context={'request': request})
    return Response(serializer.data)

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

@api_view(['GET'])
def get_trending_products(request):
    trending_products = Product.objects.filter(is_trending=True)
    
    if not trending_products.exists():
        return Response({"message": "No trending products found"}, status=404)
    
    serializer = ProductSerializer(trending_products, many=True, context={"request": request})
    return Response(serializer.data)
@api_view(['GET'])
def get_best_sellers(request):
    best_sellers = Product.objects.filter(sales_count__gt=10).order_by('-sales_count')[:10]  # ✅ Show top-selling products
    serializer = ProductSerializer(best_sellers, many=True, context={"request": request})
    return Response(serializer.data)

@api_view(['GET'])
def get_featured_products(request):
    """Fetch only products that are marked as featured."""
    featured_products = Product.objects.filter(is_featured=True)
    serializer = ProductSerializer(featured_products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(["GET"])
def get_product_detail(request, slug):
    try:
        product = Product.objects.get(slug=slug)
        serializer = ProductSerializer(product, context={"request": request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)


# views.py
@api_view(['GET', 'POST'])
def get_reviews(request):
    if request.method == 'GET':
        product_id = request.query_params.get('product')
        queryset = Review.objects.all().order_by('-created_at')
        if product_id:
            queryset = queryset.filter(product=product_id)
        serializer = ReviewSerializer(queryset[:10], many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

# store/views.py
@api_view(['GET'])
def filtered_products(request):
    category_slug = request.GET.get('category')
    product_type_slug = request.GET.get('product_type')

    # Build filter parameters
    filters = {}
    if category_slug:
        filters['category__slug'] = category_slug
    if product_type_slug:
        filters['product_type__slug'] = product_type_slug

    try:
        products = Product.objects.filter(**filters)\
            .select_related('category', 'product_type', 'brand')\
            .prefetch_related('images')
            
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)
