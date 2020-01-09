import json

from rest_framework import serializers

from inventory.models import Item, Container, ItemTag


class JSONFieldSerializerField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, str):
            return json.loads(data)
        return data

    def to_representation(self, value):
        return json.loads(json.dumps(value))


class ContainerSerializer(serializers.ModelSerializer):
    metadata = JSONFieldSerializerField()
    location_metadata = JSONFieldSerializerField(default={})

    class Meta:
        model = Container
        fields = ['id', 'name', 'image', 'description', 'container_type', 'parent', 'location_metadata', 'metadata']


class ItemSerializer(serializers.ModelSerializer):
    location_metadata = JSONFieldSerializerField(default={})

    class Meta:
        model = Item
        fields = ['id', 'name', 'image', 'description', 'quantity', 'alert_quantity', 'source', 'source_url', 'parent',
                  'tags', 'location_metadata']


class ItemTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name', 'item_set']
