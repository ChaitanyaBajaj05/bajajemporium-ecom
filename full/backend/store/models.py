from django.db import models
from django.utils.text import slugify
from django.utils.timezone import now

class Color(models.Model):
    name = models.CharField(max_length=50, unique=True)
    hex_code = models.CharField(max_length=7, default="#FFFFFF", help_text="Hex code (e.g. #FF0000 for Red)")

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True, editable=False)
    logo = models.ImageField(upload_to="brand_logos/", null=True, blank=True)  # ✅ Add this line

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            base_slug = slugify(self.name)
            slug = base_slug
            i = 1
            while Brand.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{i}"
                i += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True, editable=False)
    image = models.ImageField(upload_to="category_images/", null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            base_slug = slugify(self.name)
            slug = base_slug
            i = 1
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{i}"
                i += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ProductType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True, null=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            base_slug = slugify(self.name)
            slug = base_slug
            i = 1
            while ProductType.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{i}"
                i += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True, editable=False)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.PositiveIntegerField(default=0)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False, default=0)
    stock = models.PositiveIntegerField(default=0)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="products")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="products")
    product_type = models.ForeignKey(ProductType, on_delete=models.SET_NULL, null=True, blank=True, related_name="products")
    created_at = models.DateTimeField(default=now)

    # Fabric Details
    kurta_fabric = models.CharField(max_length=255, default="Cotton")
    bottom_fabric = models.CharField(max_length=255, default="Cotton")
    dupatta_fabric = models.CharField(max_length=255, default="Cotton")

    # Unstitched Suit Details
    kurta_length = models.DecimalField(max_digits=4, decimal_places=2, default=2.5, help_text="Kurta length in meters (e.g. 2.5)")
    bottom_length = models.DecimalField(max_digits=4, decimal_places=2, default=2.0, help_text="Bottom length in meters")
    dupatta_length = models.DecimalField(max_digits=4, decimal_places=2, default=2.25, help_text="Dupatta length in meters")
    fabric_type = models.CharField(max_length=100, default="Unstitched")
    work_type = models.CharField(max_length=100, default="Printed/Embroidered")
    occasion = models.CharField(max_length=100, default="Casual/Party/Festive")
    care_instructions = models.TextField(default="Dry clean only. Do not bleach.")

    # Colors
    primary_color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True, related_name='primary_products')
    available_colors = models.ManyToManyField(Color, blank=True, related_name='products')

    # Features
    sales_count = models.PositiveIntegerField(default=0)
    is_best_seller = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('product-detail', kwargs={'slug': self.slug})
    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            base_slug = slugify(self.name)
            slug = base_slug
            i = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{i}"
                i += 1
            self.slug = slug
        # Discounted price calculation
        if self.discount_percentage > 0:
            self.discounted_price = round(self.price - (self.price * self.discount_percentage / 100), 2)
        else:
            self.discounted_price = self.price
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="product_images/")
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    customer_name = models.CharField(max_length=255)
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.customer_name} - {self.product.name}"
