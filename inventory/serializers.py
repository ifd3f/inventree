import json

from rest_framework import serializers, validators
from rest_framework.fields import ListField
from rest_framework.relations import ManyRelatedField, PrimaryKeyRelatedField, SlugRelatedField

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


class ItemTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name', 'item_set']


class SimplifiedItemTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name']


def validate(objs):
    print(objs)


class ItemSerializer(serializers.ModelSerializer):
    location_metadata = JSONFieldSerializerField(default={})
    tags = serializers.SlugRelatedField(many=True, slug_field='name', queryset=ItemTag.objects.all())

    class Meta:
        model = Item
        fields = ['id', 'name', 'image', 'description', 'quantity', 'alert_quantity', 'source', 'source_url', 'parent',
                  'tags', 'location_metadata']
