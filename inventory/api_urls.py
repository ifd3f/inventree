from django.conf.urls import url
from django.urls import include
from rest_framework import routers, viewsets


# ViewSets define the view behavior.
from inventory.models import Item, Container, ItemTag
from inventory.serializers import ItemSerializer, ItemTagSerializer, ContainerSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class RestockItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.filter()
    serializer_class = ItemSerializer


class ContainerViewSet(viewsets.ModelViewSet):
    queryset = Container.objects.all()
    serializer_class = ContainerSerializer


class ItemTagViewSet(viewsets.ModelViewSet):
    queryset = ItemTag.objects.all()
    serializer_class = ItemTagSerializer


router = routers.DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'containers', ContainerViewSet)
router.register(r'item-tags', ItemTagViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]