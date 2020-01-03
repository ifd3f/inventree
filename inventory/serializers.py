from rest_framework import serializers

from inventory.models import Item, Container, ItemTag


class ContainerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Container
        fields = ['id', 'name', 'image', 'description', 'location', 'container_type', 'parent']


class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'image', 'description', 'quantity', 'alert_quantity', 'source', 'source_url', 'parent', 'tags']


class ItemTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name', 'item_set']
