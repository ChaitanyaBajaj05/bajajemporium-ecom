from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatMessageViewSet

router = DefaultRouter()
router.register(r'chat', ChatMessageViewSet, basename='chat')

urlpatterns = [
    path('api/', include(router.urls)),
]
