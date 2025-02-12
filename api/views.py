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
            url = "https://skyview.gsfc.nasa.gov/current/cgi/vo/sia.pl"
            params = {
                "POS": "0,0",  # Center position (RA,Dec)
                "SIZE": "1",  # Size in degrees
                "SURVEY": "DSS",  # Digital Sky Survey
            }

            response = requests.get(url, params=params)
            response.raise_for_status()

            return Response(response.json())

        except requests.RequestException as e:
            return Response({"error": str(e)}, status=500)
