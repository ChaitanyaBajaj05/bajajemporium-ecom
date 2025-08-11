from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Customer
    message = models.TextField()
    response = models.TextField(blank=True, null=True)  # Bot or admin reply
    is_from_admin = models.BooleanField(default=False)  # ✅ To identify if admin sent it
    timestamp = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.timestamp + timedelta(hours=24)

    def __str__(self):
        sender = "Admin" if self.is_from_admin else self.user.username
        return f"{sender} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}: {self.message}"
