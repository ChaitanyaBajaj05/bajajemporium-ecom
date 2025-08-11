from django.urls import path
from .views import (
    RegisterView,
    VerifyOTPView,
    LoginView,
    get_profile,
    update_profile,
    change_password,
    delete_account
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', get_profile, name='get_profile'),
    path('profile/update/', update_profile, name='update_profile'),
    path('profile/change-password/', change_password, name='change_password'),
    path('profile/delete/', delete_account, name='delete_account'),
]
