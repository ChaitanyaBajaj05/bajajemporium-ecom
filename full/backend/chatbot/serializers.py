from rest_framework import serializers
from .models import ChatMessage
from django.contrib.auth.models import User
import random

# Smart bot replies for customer messages
BOT_REPLIES = [
    "Thank you for your message. We'll get back to you shortly.",
    "Can you please provide more details?",
    "Sure! Let me check on that for you.",
    "That’s great to hear! 😊",
    "For bridal wear, we recommend checking our Gangaa or Netra collections.",
    "This item is available in-store and online.",
    "You can also try our festive collection for more options!",
    "You may also want to check Tata, Croma, or Nykaa for inspiration!",
]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ChatMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'user',
            'user_id',           # Admin can set user
            'message',
            'response',
            'is_from_admin',
            'timestamp',
        ]
        read_only_fields = ['id', 'user', 'timestamp', 'response']

    def create(self, validated_data):
        request_user = self.context['request'].user
        user_field = validated_data.pop('user_id', None)

        # Set target user: admin-sent or customer
        target_user = user_field if user_field else request_user

        # Create main message
        message = ChatMessage.objects.create(
            user=target_user,
            is_from_admin=request_user.is_staff,
            **validated_data
        )

        # Auto-bot reply for customer
        if not request_user.is_staff:
            auto_reply = random.choice(BOT_REPLIES)
            message.response = auto_reply
            message.save()

        return message
