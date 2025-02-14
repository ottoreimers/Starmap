import requests
from decouple import config
from django.conf import settings
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Planet


class NASADataView(APIView):
    def get(self, request):
        try:
            nasa_url = "https://api.nasa.gov/planetary/apod"
            params = {"api_key": settings.NASA_API_KEY}

            response = requests.get(nasa_url, params=params)
            response.raise_for_status()

            return Response(response.json(), status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response(
                {"error": "Failed to fetch NASA data", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class APODView(APIView):
    def get(self, request):
        api_key = config("NASA_API_KEY")
        url = "https://api.nasa.gov/planetary/apod"

        try:
            params = {"api_key": api_key}
            response = requests.get(url, params=params)
            response.raise_for_status()

            return Response(response.json(), status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PlanetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planet
        fields = "__all__"


class PlanetPositionsView(APIView):
    def get(self, request):
        planets = Planet.objects.all().order_by("distance")
        serializer = PlanetSerializer(planets, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
