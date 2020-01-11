from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render


def profile_view(request):
    return render(request, 'profile.html', {})


def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})


def ping(request):
    return JsonResponse({'result': 'OK'})
