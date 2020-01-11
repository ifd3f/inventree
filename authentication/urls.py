from django.conf.urls import url
from django.urls import path, include

from . import views

urlpatterns = [
    path('csrf/', views.csrf),
    path('ping/', views.ping),
    url(r'^rest-auth/', include('rest_auth.urls')),
]
