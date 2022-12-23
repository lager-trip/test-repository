from django import forms
from .models import Route, City, Country, State
from django.forms import Form


class RouteForm(forms.ModelForm):
    class Meta:
        model = Route
        fields = ['route_name', 'lvl', 'about',
                  'total_distance', 'country', 'state', 'city', 'url', ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['route_name'].widget.attrs.update(
            {'class': 'form-control', 'placeholder': 'Give a short name to the route'})
        self.fields['lvl'].widget.attrs.update(
            {'class': 'slider col-md-10', 'id': 'customRange1', 'min': '1', 'max': '10'})
        self.fields['lvl'].widget.input_type = 'range'
        self.fields['about'].widget.attrs.update(
            {'class': 'form-control', 'rows': '2'})
        self.fields['total_distance'].widget.attrs.update(
            {'class': 'form-control'})
        self.fields['country'].widget.attrs.update(
            {'class': 'form-select', 'placeholder': 'Choose country'})
        self.fields['state'].widget.attrs.update({'class': 'form-select'})
        self.fields['city'].widget.attrs.update({'class': 'form-select'})

        self.fields['url'].widget.attrs.update(
            {'class': 'form-control', 'id':'get-url',})
