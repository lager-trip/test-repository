from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.views.generic import ListView, CreateView, UpdateView
from django.shortcuts import render, get_object_or_404, get_list_or_404

from .forms import RouteForm

from .models import Route


def home(request):
    return render(request, 'routes_form/test_page3.html')


def search(request):
    routes = Route.objects.all()
    return render(request, 'routes_form/search_route_page.html', {'routes': routes})


def url_parsing(request):
    user_input = request.GET.get('inputValue')

    urlAjax = Route.objects.get(pk=int(user_input))
    # (pk=int(user_input))
    # urlAjax2 = urlAjax.url
    urlRequestList = parsing(urlAjax.url)
    data = {
        'url': urlRequestList,
        'about': urlAjax.about,
    }
    # print(data)
    return JsonResponse(data)


# FORMS


def getForm(request):
    form = RouteForm()
    if request.method == 'POST':
        form = RouteForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/search')

    return render(request, 'routes_form/create_route_page.html', {'form': form})


# print(parsing(a))

# Parsing requestURL
def parsing(requestURL):
    # Extracting coordinates from URL to one string
    coordinatesFromURL = requestURL[(requestURL.index(
        'profile/') + len('profile/')): requestURL.index('?')]
    coordinateStringList = coordinatesFromURL.split(
        ';')  # Creating a list of Coordinates as Strings
    # Creating a two-dimensional list from coordinates
    coordinatePairs = [i.split(',') for i in coordinateStringList]
    # Convert strings to decimals
    stringToFloat = [[float(j) for j in i] for i in coordinatePairs]
    return stringToFloat  # Returning prepared pairs of coordinates in a list


# {% extends 'routes_form/base.html' %}
# {% load static %}

# {% block content_form %}
# {% include 'routes_form/partials/_search_form.html' %}
# {% endblock %}

# {% block script %}
# <script src="{% static 'routes_form/searching_script.js' %}"></script>
# {% endblock %}
