from django.urls import path, include, re_path
# from django.conf.urls import url
from . import views

urlpatterns = [
    path('share/', views.getForm, name='share'),
    path('search/', views.search, name='search'),
    path('', views.home, name='home'),
    re_path('get_response/', views.url_parsing, name='get_response'),
]