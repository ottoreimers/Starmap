from django.db import models


class Planet(models.Model):
    name = models.CharField(max_length=100)
    distance = models.FloatField()
    magnitude = models.FloatField()
    color = models.CharField(max_length=7)
    type = models.CharField(max_length=100)
    size = models.IntegerField()
    orbital_period = models.IntegerField()
    temperature = models.IntegerField()
    description = models.TextField()

    def __str__(self):
        return self.name
