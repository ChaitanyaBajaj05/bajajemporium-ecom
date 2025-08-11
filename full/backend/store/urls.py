from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    ProductViewSet,
    BrandViewSet,
    ProductImageViewSet,
    get_categories,
    filtered_products,
    get_trending_products,
    get_best_sellers,
    get_featured_products,
    get_product_detail,
    get_reviews
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'product-images', ProductImageViewSet, basename='product-image')

urlpatterns = [
    # Custom API endpoints
    path('products/trending/', get_trending_products, name="trending-products"),
    path('products/best-sellers/', get_best_sellers, name="best-sellers"),
    path('products/featured/', get_featured_products, name="featured-products"),
    path('products/<slug:slug>/', get_product_detail, name="product-detail"),
    path('categories/', get_categories, name="categories"),
    path('filtered-products/', filtered_products, name="filtered-products"),
    path('reviews/', get_reviews, name="reviews"),

    # DRF Router URLs
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
