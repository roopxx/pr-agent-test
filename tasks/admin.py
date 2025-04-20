from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_date', 'due_date')
    list_filter = ('status', 'created_date', 'due_date')
    search_fields = ('title', 'description')

admin.site.register(Task, TaskAdmin)