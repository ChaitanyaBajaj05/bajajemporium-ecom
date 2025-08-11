from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, EmailOTP
from django.core.mail import send_mail

# ✅ Serialize base user info
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# ✅ Serialize profile data including user fields
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ['user', 'avatar', 'phone', 'address', 'pincode', 'city', 'state', 'country']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

# ✅ Handle registration and OTP sending
class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["name", "email", "password"]

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        name = validated_data["name"]

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email already exists")

        # ✅ Create user (hash password, inactive)
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            is_active=False
        )
        user.first_name = name
        user.save()

        # ✅ Create or reuse OTP entry
        otp_entry, _ = EmailOTP.objects.get_or_create(user=user)
        otp = otp_entry.generate_otp()

        # ✅ Send OTP email
        send_mail(
            subject='Your OTP Code',
            message=f'Your OTP is: {otp}',
            from_email='youremail@gmail.com',  # 🔁 Replace with your real sender email
            recipient_list=[email],
            fail_silently=False,
        )

        return user

# ✅ Handle OTP verification and user activation
class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get("email")
        otp = data.get("otp")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "User does not exist"})

        try:
            otp_entry = EmailOTP.objects.get(user=user)
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError({"non_field_errors": ["OTP not found"]})

        if str(otp_entry.otp).strip() != str(otp).strip():
            raise serializers.ValidationError({"otp": "Invalid OTP"})

        # ✅ OTP correct → activate user + delete OTP
        user.is_active = True
        user.save()
        otp_entry.delete()

        data["user"] = user
        return data
