from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from datetime import timedelta

class IsAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.user == request.user

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return ChatMessage.objects.all().order_by('-timestamp')
        return ChatMessage.objects.filter(user=user).order_by('-timestamp')

    def perform_create(self, serializer):
        message = serializer.validated_data.get('message', '')
        is_admin = serializer.validated_data.get('is_from_admin', False)

        # Admin sending message to user (via user_id from serializer)
        if self.request.user.is_staff and is_admin:
            serializer.save()
        else:
            # Normal user message
            serializer.save(user=self.request.user)

            # Optional: Auto-reply from bot/admin
            ChatMessage.objects.create(
                user=self.request.user,
                message="(Auto Reply)",
                response="Thanks for reaching out! We'll get back to you shortly.",
                is_from_admin=True
            )

    @action(detail=False, methods=['get'], url_path='my_chat')
    def my_chat(self, request):
        """Return current user's chat history"""
        messages = ChatMessage.objects.filter(user=request.user).order_by('timestamp')
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'], url_path='clear_expired')
    def clear_expired(self, request):
        """Delete chat messages older than 24 hours (admin only)"""
        if not request.user.is_staff:
            return Response({"detail": "Only admins can delete expired chats."}, status=403)

        expired_time = timezone.now() - timedelta(hours=24)
        expired_messages = ChatMessage.objects.filter(timestamp__lt=expired_time)
        count = expired_messages.count()
        expired_messages.delete()

        return Response({"message": f"Deleted {count} expired messages."}, status=200)
