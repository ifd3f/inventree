from django.contrib.auth.models import User
from django.db.models import F, Sum
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from inventory.models import Item, Container, ItemTag
from inventory.serializers import ItemSerializer, ItemTagSerializer, ContainerSerializer, UserSerializer, \
    ItemSearchSerializer, ContainerSearchSerializer, ItemTagSuggestSerializer


class ItemViewSet(ModelViewSet):
    serializer_class = ItemSerializer
    parser_classes = [JSONParser]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        query = Item.objects.all()

        should_filter_restock = self.request.query_params.get('needs_restock', False)
        if should_filter_restock:
            query = query.filter(quantity__lte=F('alert_quantity'))

        parent = self.request.query_params.get('parent', None)
        if parent:
            if parent == '0':
                query = query.filter(parent__isnull=True)
            else:
                query = query.filter(parent__exact=parent)
        return query

    @staticmethod
    def ensure_tags(request):
        tag_names = request.data.get('tags', [])
        for tag_name in tag_names:
            ItemTag.objects.get_or_create(name=tag_name)

    def update(self, request, *args, **kwargs):
        self.ensure_tags(request)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        self.ensure_tags(request)
        return super().partial_update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.ensure_tags(request)
        return super().create(request, *args, **kwargs)


class ContainerViewSet(ModelViewSet):
    serializer_class = ContainerSerializer
    parser_classes = [JSONParser]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            "depth": int(self.request.query_params.get("depth", 0))
        })
        return context

    def get_queryset(self):
        query = Container.objects.all()

        parent = self.request.query_params.get('parent', None)
        if parent:
            if parent == '0':
                query = query.filter(parent__isnull=True)
            else:
                query = query.filter(parent__exact=parent)

        return query

    @action(methods=['get'], detail=True)
    def parents(self, request, pk):
        container = Container.objects.get(pk=pk)
        node = container
        path = []
        while node is not None:
            path.append(node)
            node = node.parent
        serializer = ContainerSerializer(path, many=True, context={'request': request})
        return Response(serializer.data)

    @action(methods=['get'], detail=True)
    def items(self, request, pk):
        items = Item.objects.filter(parent__exact=pk)
        serializer = ItemSerializer(items, many=True, context={'request': request})
        return Response(serializer.data)

    @action(methods=['get'], detail=True)
    def children(self, request: Request, pk):
        containers = Container.objects.filter(parent__exact=pk)
        depth = request.query_params.get("depth", 0)
        serializer = ContainerSerializer(
            containers,
            many=True,
            context={'request': request, 'depth': depth}
        )
        return Response(serializer.data)


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    parser_classes = [JSONParser]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

    @action(methods=['get'], detail=False)
    def current(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


class ItemTagViewSet(ModelViewSet):
    queryset = ItemTag.objects.all()
    serializer_class = ItemTagSerializer


class InfoView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({
            'total_item_count': Item.objects.aggregate(item_count=Sum('quantity'))['item_count'],
            'container_count': Container.objects.count()
        })


class AllParentsView(ModelViewSet):
    serializer_class = Container

    def get_queryset(self):
        node = Container.objects.get(id=self.request.query_params['id'])
        out = []
        while node is not None:
            out.append(node)
            node = node.parent
        return out


class ItemSearchViewSet(ModelViewSet):
    index_models = [Item]
    permission_classes = [AllowAny]
    queryset = Item.objects.all()
    serializer_class = ItemSearchSerializer


class ContainerSearchViewSet(ModelViewSet):
    index_models = [Container]
    permission_classes = [AllowAny]
    queryset = Container.objects.all()
    serializer_class = ContainerSearchSerializer


class ItemTagSuggestViewSet(ModelViewSet):
    index_models = [ItemTag]
    permission_classes = [AllowAny]
    queryset = ItemTag.objects.all()
    serializer_class = ItemTagSuggestSerializer
