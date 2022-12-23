from django.db import models
from smart_selects.db_fields import ChainedForeignKey


class Country(models.Model):
    shortname = models.CharField(max_length=2)
    country = models.CharField(max_length=50)
    phonecode = models.IntegerField(default=0)

    def __str__(self):
        return self.country


class State(models.Model):
    state = models.CharField(max_length=50)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    def __str__(self):
        return self.state


class City(models.Model):
    city = models.CharField(max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE)

    def __str__(self):
        return self.city

class Route(models.Model):
    route_name = models.CharField(max_length=50)
    lvl = models.IntegerField(default=0)
    about = models.TextField(max_length=1500)
    total_distance = models.IntegerField(default=0)
    url = models.CharField(max_length=1000)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state = ChainedForeignKey(
        State,
        chained_field="country",
        chained_model_field="country",
        show_all=False,
        auto_choose=True,
        sort=True,
    )
    city = ChainedForeignKey(
        City,
        chained_field="state",
        chained_model_field="state",
        show_all=False,
        auto_choose=True,
        sort=True,
    )

    def __str__(self):
        return self.route_name

    def __str__(self):
        return self.about

    def __str__(self):
        return self.url
