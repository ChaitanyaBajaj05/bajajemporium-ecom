from django.contrib import admin
from .models import Product, Brand, ProductImage, Category, Review, ProductType, Color
from django.utils.html import format_html

# Brand Admin with logo preview
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "logo_preview")
    readonly_fields = ("slug", "logo_preview")
    search_fields = ("name",)

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height: 60px;" />', obj.logo.url)
        return "-"
    logo_preview.short_description = "Logo Preview"

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    readonly_fields = ("slug",)
    search_fields = ("name",)

class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    readonly_fields = ("slug",)
    search_fields = ("name",)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image_preview', 'image', 'alt_text')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"

class ColorFilter(admin.SimpleListFilter):
    title = 'Color'
    parameter_name = 'color'

    def lookups(self, request, model_admin):
        colors = Color.objects.all()
        return [(color.id, color.name) for color in colors]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(available_colors__id=self.value())
        return queryset

class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name", "brand", "fabric_type", "work_type", "occasion",
        "primary_color", "get_available_colors", "price", "discounted_price", "stock"
    )
    readonly_fields = ("slug", "discounted_price")
    list_filter = (
        "brand", "category", "fabric_type", "work_type", "occasion",
        ColorFilter, "is_featured", "is_best_seller"
    )
    filter_horizontal = ('available_colors',)
    search_fields = (
        "name", "brand__name", "category__name", "product_type__name",
        "kurta_fabric", "work_type"
    )
    inlines = [ProductImageInline]

    fieldsets = (
        ("Basic Info", {
            'fields': ('name', 'slug', 'description', 'brand', 'category', 'product_type')
        }),
        ("Pricing & Stock", {
            'fields': ('price', 'discount_percentage', 'discounted_price', 'stock')
        }),
        ("Fabric Details", {
            'fields': (
                'kurta_fabric', 'bottom_fabric', 'dupatta_fabric',
                'fabric_type', 'work_type', 'occasion'
            )
        }),
        ("Measurements", {
            'fields': ('kurta_length', 'bottom_length', 'dupatta_length')
        }),
        ("Colors", {
            'fields': ('primary_color', 'available_colors')
        }),
        ("Features", {
            'fields': ('is_featured', 'is_best_seller', 'is_trending', 'sales_count')
        }),
    )

    def get_available_colors(self, obj):
        return ", ".join([color.name for color in obj.available_colors.all()])
    get_available_colors.short_description = "Available Colors"

class ReviewAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "product", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("customer_name", "product__name", "comment")
    readonly_fields = ("created_at",)

# Register all models
admin.site.register(Color)
admin.site.register(Brand, BrandAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(ProductType, ProductTypeAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage)
admin.site.register(Review, ReviewAdmin)
