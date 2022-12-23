from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic import ListView, CreateView, UpdateView
from django.shortcuts import render, get_object_or_404, get_list_or_404

from .forms import RouteForm

from .models import Route


def home(request):
    return HttpResponse("Some page")

# FORMS


def getForm(request):
    form = RouteForm()
    if request.method == 'POST':
        form = RouteForm(request.POST)
        if form.is_valid():
            form.save()
        
    return render(request, 'routes_form/route_form.html', {'form': form})