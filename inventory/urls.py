from django.conf.urls import url
from django.urls import include
from rest_framework import routers

from inventory.views import ItemViewSet, ContainerViewSet, ItemTagViewSet, InfoView, UserViewSet, \
    ItemSearchViewSet, ContainerSearchViewSet

router = routers.DefaultRouter()
router.register(r'items/search', ItemSearchViewSet, basename='items-search')
router.register(r'items', ItemViewSet, basename='item')
router.register(r'containers/search', ContainerSearchViewSet, basename='containers-search')
router.register(r'containers', ContainerViewSet, basename='container')
router.register(r'item-tags', ItemTagViewSet)
router.register(r'users', UserViewSet, basename='users')


urlpatterns = [
    url(r'^info$', InfoView.as_view()),
    url(r'^', include(router.urls)),
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
]
