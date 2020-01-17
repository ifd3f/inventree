import json

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from drf_haystack.serializers import HaystackSerializerMixin
from rest_framework import serializers
from rest_framework.fields import Field
from rest_framework.serializers import ModelSerializer, Serializer

from inventory.models import Item, Container, ItemTag


class JSONFieldSerializerField(Field):
    def to_internal_value(self, data):
        if isinstance(data, str):
            return json.loads(data)
        return data

    def to_representation(self, value):
        return json.loads(json.dumps(value))


class ContainerSerializer(ModelSerializer):
    metadata = JSONFieldSerializerField()
    location_metadata = JSONFieldSerializerField(default={})

    class Meta:
        model = Container
        fields = ['id', 'name', 'image', 'description', 'container_type', 'parent', 'location_metadata', 'metadata',
                  'qr_uuid']


class ItemTagSerializer(ModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name', 'item_set']


class SimplifiedItemTagSerializer(ModelSerializer):
    class Meta:
        model = ItemTag
        fields = ['name']


class ItemSerializer(ModelSerializer):
    location_metadata = JSONFieldSerializerField(default={})
    tags = serializers.SlugRelatedField(many=True, slug_field='name', queryset=ItemTag.objects.all(), default=[])

    class Meta:
        model = Item
        fields = ['id', 'name', 'image', 'description', 'quantity', 'alert_quantity', 'source', 'source_url', 'parent',
                  'tags', 'location_metadata', 'qr_uuid']


class LoginFormSerializer(Serializer):
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


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username']


class ItemSearchSerializer(HaystackSerializerMixin, ItemSerializer):
    class Meta(ItemSerializer):
        model = Item
        search_fields = ("text",)
        fields = ItemSerializer.Meta.fields


class ContainerSearchSerializer(HaystackSerializerMixin, ContainerSerializer):
    class Meta:
        model = Container
        search_fields = ("text",)
        fields = ContainerSerializer.Meta.fields


class ItemTagSuggestSerializer(HaystackSerializerMixin, ModelSerializer):
    class Meta:
        model = ItemTag
        search_fields = ("name",)
        fields = ("name",)
