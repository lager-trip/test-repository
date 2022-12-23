from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.getForm, name='Form'),
    path('home/', views.home, name='Home'),
]