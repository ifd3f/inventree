from django.conf.urls import url
from django.urls import include
from rest_framework import routers

from inventory.views import ItemViewSet, ContainerViewSet, ItemTagViewSet, InfoView, UserViewSet,  ItemSearchViewSet, \
   ContainerSearchViewSet, ItemTagSuggestViewSet

router = routers.DefaultRouter()
router.register(r'v1/items/search', ItemSearchViewSet, basename='items-search')
router.register(r'v1/items', ItemViewSet, basename='item')
router.register(r'v1/containers/search', ContainerSearchViewSet, basename='containers-search')
router.register(r'v1/containers', ContainerViewSet, basename='container')
router.register(r'v1/item-tags/suggest', ItemTagSuggestViewSet, basename='item-tags-suggest')
router.register(r'v1/item-tags', ItemTagViewSet)
router.register(r'v1/users', UserViewSet, basename='users')


urlpatterns = [
    url(r'^info$', InfoView.as_view()),
    url(r'^', include(router.urls)),
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
]
