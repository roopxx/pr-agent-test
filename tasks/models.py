from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_date = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    def __str__(self):
        return self.title
    
    def is_overdue(self):
        if self.due_date and self.status != 'completed':
            return timezone.now() > self.due_date
        return False
    
    def is_completed(self):
        return self.status == 'completed'
    
    def mark_completed(self):
        self.status = 'completed'
        self.save()
    
    def mark_in_progress(self):
        self.status = 'in_progress'
        self.save()
    
    def days_until_due(self):
        if self.due_date:
            delta = self.due_date - timezone.now()
            return max(0, delta.days)
        return None