import requests
from django.http import JsonResponse
from django.conf import settings
from datetime import datetime

def get_weather(request):
    city = request.GET.get('city', 'Amsterdam')
    api_key = settings.OPENWEATHERMAP_API_KEY

    # Huidige weergegevens ophalen
    current_url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=nl'
    current_response = requests.get(current_url)
    current_data = current_response.json()

    if current_response.status_code != 200:
        return JsonResponse({'error': 'Stad niet gevonden'}, status=404)

    # Controleer of de benodigde gegevens aanwezig zijn in de API-respons
    if 'main' not in current_data or 'weather' not in current_data:
        return JsonResponse({'error': 'Onvolledige gegevens ontvangen van de API'}, status=500)

    # Huidige weergegevens samenstellen
    weather_data = {
        'city': current_data['name'],
        'temperature': current_data['main']['temp'],
        'feels_like': current_data['main'].get('feels_like'),  # Gevoelstemperatuur
        'pressure': current_data['main'].get('pressure'),  # Luchtdruk
        'description': current_data['weather'][0]['description'],
        'humidity': current_data['main']['humidity'],
        'windSpeed': current_data['wind']['speed'],
        'icon': current_data['weather'][0]['icon'],
        'sunrise': datetime.fromtimestamp(current_data['sys']['sunrise']).strftime('%H:%M'),
        'sunset': datetime.fromtimestamp(current_data['sys']['sunset']).strftime('%H:%M'),
    }

    # 5-daagse voorspelling ophalen
    forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric&lang=nl'
    forecast_response = requests.get(forecast_url)
    forecast_data = forecast_response.json()

    # Controleer op fouten in de voorspelling
    if forecast_response.status_code != 200:
        return JsonResponse({'error': 'Voorspellingsgegevens niet beschikbaar'}, status=500)

    # Uurlijkse voorspelling (om de 3 uur)
    hourly_forecast = []
    for entry in forecast_data['list'][:8]:  # Eerste 24 uur (8 * 3 uur)
        hourly_forecast.append({
            'time': datetime.fromtimestamp(entry['dt']).strftime('%d %b %H:%M'),
            'temp': entry['main']['temp']
        })

    # 5-daagse voorspelling
    forecast = []
    days_added = set()
    for entry in forecast_data['list']:
        date = datetime.fromtimestamp(entry['dt'])
        day_name = date.strftime('%a')  # Bijvoorbeeld 'Mon', 'Tue', etc.
        if day_name not in days_added and date.hour == 12:
            forecast.append({
                'day': day_name,
                'icon': entry['weather'][0]['icon'],
                'minTemp': entry['main']['temp_min'],
                'maxTemp': entry['main']['temp_max']
            })
            days_added.add(day_name)
        if len(forecast) == 5:
            break

    # Voeg de voorspelling en uurlijkse data toe aan het weerdata-object
    weather_data['hourlyForecast'] = hourly_forecast
    weather_data['forecast'] = forecast

    return JsonResponse(weather_data)
