from django.contrib import admin
from .models import ChatMessage

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'short_message', 'short_response', 'is_from_admin', 'timestamp')
    list_filter = ('is_from_admin', 'timestamp')
    search_fields = ('user__username', 'message', 'response')
    ordering = ('-timestamp',)

    def short_message(self, obj):
        return (obj.message[:50] + '...') if len(obj.message) > 50 else obj.message
    short_message.short_description = 'User Message'

    def short_response(self, obj):
        return (obj.response[:50] + '...') if len(obj.response) > 50 else obj.response
    short_response.short_description = 'Bot/Admin Reply'
