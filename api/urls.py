from django.urls import path

from .views import APODView, PlanetPositionsView

urlpatterns = [
    path("apod/", APODView.as_view(), name="apod"),
    path("planets/", PlanetPositionsView.as_view(), name="planets"),
]
