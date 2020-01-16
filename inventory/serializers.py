import json

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from drf_haystack.serializers import HaystackSerializer, HaystackSerializerMixin
from rest_framework import serializers, validators
from rest_framework.fields import ListField
from rest_framework.relations import ManyRelatedField, PrimaryKeyRelatedField, SlugRelatedField

from inventory.search_indexes import ItemIndex
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
        fields = ['id', 'name', 'image', 'description', 'container_type', 'parent', 'location_metadata', 'metadata',
                  'qr_uuid']


class ItemTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name', 'item_set']


class SimplifiedItemTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name']


class ItemSerializer(serializers.ModelSerializer):
    location_metadata = JSONFieldSerializerField(default={})
    tags = serializers.SlugRelatedField(many=True, slug_field='name', queryset=ItemTag.objects.all(), default=[])

    class Meta:
        model = Item
        fields = ['id', 'name', 'image', 'description', 'quantity', 'alert_quantity', 'source', 'source_url', 'parent',
                  'tags', 'location_metadata', 'qr_uuid']


class LoginFormSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username is None:
            raise serializers.ValidationError('A username must be provided.')
        if password is None:
            raise serializers.ValidationError('A password must be provided.')

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError('This user does not exist.')
        if not user.is_active:
            raise serializers.ValidationError('This user has been deactivated.')

        return {
            'username': user.username,
            'token': user.token
        }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class ItemSearchSerializer(HaystackSerializerMixin, ItemSerializer):
    class Meta:
        model = Item
        search_fields = ("text",)
        fields = ItemSerializer.Meta.fields
