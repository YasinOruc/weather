import requests
from django.http import JsonResponse
from django.conf import settings

def get_weather(request):
    city = request.GET.get('city', 'Amsterdam')
    api_key = settings.OPENWEATHERMAP_API_KEY
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=nl'
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data)
