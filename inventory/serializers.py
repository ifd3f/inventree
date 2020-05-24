import json

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
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

    parents = serializers.SerializerMethodField('get_parents')
    items = serializers.SerializerMethodField('get_items')
    sub_containers = serializers.SerializerMethodField('get_sub_containers')

    @staticmethod
    def get_parents(container: Container):
        parent = container.parent
        if parent is None:
            return []

        path = []
        node = parent
        while node is not None:
            path.append(node.id)
            node = node.parent
        return path

    @staticmethod
    def get_items(container: Container):
        items = container.item_set.all()
        serializer = ItemSerializer(items, many=True)
        return serializer.data

    def get_sub_containers(self, container: Container):
        subs = container.container_set.all()
        depth = self.context.get("depth", 0)
        if depth <= 0:
            return [s.id for s in subs]
        else:
            serializer = ContainerSerializer(
                subs,
                many=True,
                context={**self.context, 'depth': depth - 1}
            )
            return serializer.data

    class Meta:
        model = Container
        fields = [
            'id',
            'name',
            'image',
            'description',
            'items',
            'container_type',
            'parents',
            'sub_containers',
            'location_metadata',
            'metadata',
            'qr_uuid'
        ]


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
    parents = serializers.SerializerMethodField('get_parents')

    @staticmethod
    def get_parents(item: Item):
        parent = item.parent
        if parent is None:
            return []

        path = []
        node = parent
        while node is not None:
            path.append(node.id)
            node = node.parent
        return path

    class Meta:
        model = Item
        fields = [
            'id',
            'name',
            'image',
            'description',
            'quantity',
            'alert_quantity',
            'source',
            'source_url',
            'parents',
            'tags',
            'location_metadata',
            'qr_uuid'
        ]


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


class ItemSearchSerializer(ItemSerializer):
    class Meta(ItemSerializer):
        model = Item
        search_fields = ("text",)
        fields = ItemSerializer.Meta.fields


class ContainerSearchSerializer(ContainerSerializer):
    class Meta:
        model = Container
        search_fields = ("text",)
        fields = ContainerSerializer.Meta.fields


class ItemTagSuggestSerializer(ModelSerializer):
    class Meta:
        model = ItemTag
        search_fields = ("name",)
        fields = ("name",)
