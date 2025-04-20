from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Task
from django.utils import timezone

class TaskListView(ListView):
    model = Task
    template_name = 'tasks/task_list.html'
    context_object_name = 'tasks'
    ordering = ['-created_date']

class TaskDetailView(DetailView):
    model = Task
    template_name = 'tasks/task_detail.html'
    context_object_name = 'task'

class TaskCreateView(CreateView):
    model = Task
    template_name = 'tasks/task_form.html'
    fields = ['title', 'description', 'due_date', 'status']
    success_url = reverse_lazy('task-list')

class TaskUpdateView(UpdateView):
    model = Task
    template_name = 'tasks/task_form.html'
    fields = ['title', 'description', 'due_date', 'status']
    success_url = reverse_lazy('task-list')

class TaskDeleteView(DeleteView):
    model = Task
    template_name = 'tasks/task_confirm_delete.html'
    success_url = reverse_lazy('task-list')

def mark_task_completed(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.status = 'Completed'
    task.save()
    return redirect('task-list')

def task_search(request):
    query = request.GET.get('query', '')
    if query:
        tasks = Task.objects.filter(title__icontains=query) | Task.objects.filter(description__icontains=query)
    else:
        tasks = Task.objects.all().order_by('-created_date')
    
    return render(request, 'tasks/task_search.html', {'tasks': tasks, 'query': query})

def tasks_by_status(request, status):
    tasks = Task.objects.filter(status=status).order_by('-created_date')
    return render(request, 'tasks/task_list.html', {'tasks': tasks, 'status': status})

def overdue_tasks(request):
    tasks = Task.objects.filter(due_date__lt=timezone.now(), status__not='Completed').order_by('due_date')
    return render(request, 'tasks/task_list.html', {'tasks': tasks, 'list_title': 'Overdue Tasks'})
