from django.urls import path

from . import views

urlpatterns = [
    path('add', views.add, name='add'),
    path('search', views.search, name='search'),
    path('item/<int:item_id>', views.item_detail, name='item'),
    path('container/<int:container_id>', views.container_detail, name='container'),
    path('', views.index, name='index'),
]

