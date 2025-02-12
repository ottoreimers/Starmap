from django.urls import path

from .views import APODView, StarPositionsView

urlpatterns = [
    path("apod/", APODView.as_view(), name="apod"),
    path("stars/", StarPositionsView.as_view(), name="stars"),
]
