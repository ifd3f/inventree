from rest_framework import serializers

from inventory.models import Item, Container, ItemTag


class ContainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Container
        fields = ['id', 'name', 'image', 'description', 'location', 'container_type', 'parent', 'container_metadata']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'image', 'description', 'quantity', 'alert_quantity', 'source', 'source_url', 'parent',
                  'tags', 'container_metadata']


class ItemTagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name', 'item_set']
