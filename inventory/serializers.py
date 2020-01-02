from rest_framework import serializers

from inventory.models import Item, Container, ItemTag


class ContainerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Container
        fields = ['name', 'image', 'description', 'location', 'container_type']


class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ['name', 'image', 'description', 'quantity', 'alert_quantity', 'source', 'source_url', 'parent', 'tags']


class ItemTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name', 'item_set']

