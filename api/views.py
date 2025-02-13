import requests
from decouple import config
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


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


class StarPositionsView(APIView):
    def get(self, request):
        try:
            stars = [
                {"name": "Sirius", "ra": "06h45m08.9173s", "dec": "-16d42m58.0171s"},
                {"name": "Vega", "ra": "18h36m56.3363s", "dec": "+38d47m01.2802s"},
                {"name": "Canopus", "ra": "06h23m57.1099s", "dec": "-52d41m44.3781s"},
            ]
            return Response(stars)

        except requests.RequestException as e:
            return Response({"error": str(e)}, status=500)
