from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import UserProfile, EmailOTP
from .Serializers import RegisterSerializer, UserProfileSerializer, OTPVerifySerializer
from django.core.mail import send_mail
import logging

logger = logging.getLogger(__name__)


# ✅ Register user and send OTP
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully. OTP sent to email."},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # 🔍 Debug incoming data
        print("📨 Incoming request data to verify OTP:", request.data)

        serializer = OTPVerifySerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)

            print("✅ OTP verified for user:", user.email)

            return Response({
                "message": "OTP verified successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })

        # 🛑 If not valid, log what went wrong
        print("❌ OTP verification failed with errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({"detail": "Account is not activated."}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })


# ✅ Get user profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)


# ✅ Update profile
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    profile = user.userprofile

    user.first_name = request.data.get("first_name", user.first_name)
    user.last_name = request.data.get("last_name", user.last_name)
    user.email = request.data.get("email", user.email)
    user.save()

    profile.phone = request.data.get("phone", profile.phone)
    profile.address = request.data.get("address", profile.address)
    profile.pincode = request.data.get("pincode", profile.pincode)
    profile.city = request.data.get("city", profile.city)
    profile.state = request.data.get("state", profile.state)
    profile.country = request.data.get("country", profile.country)

    if 'avatar' in request.FILES:
        profile.avatar = request.FILES['avatar']

    profile.save()
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)


# ✅ Change password
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current = request.data.get("current_password")
    new = request.data.get("new_password")

    if not user.check_password(current):
        return Response({"error": "Current password is incorrect"}, status=400)

    user.set_password(new)
    user.save()
    return Response({"message": "Password updated successfully"})


# ✅ Delete account
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_account(request):
    request.user.delete()
    return Response({"message": "Account deleted successfully"})
