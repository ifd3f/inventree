from django.core.exceptions import ValidationError
from django.db import models
from jsonfield import JSONField


CONTAINER_TYPE_DEFAULT = 0
CONTAINER_TYPE_GRID = 1
CONTAINER_TYPE_FREEFORM = 2

CONTAINER_TYPE_CHOICES = [
    (CONTAINER_TYPE_DEFAULT, 'default'),
    (CONTAINER_TYPE_GRID, 'grid'),
    (CONTAINER_TYPE_FREEFORM, 'freeform')
]


class Node(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='container/', null=True)

    parent = models.ForeignKey('Container', on_delete=models.SET_NULL, blank=True, null=True)
    location_metadata = JSONField(default={}, blank=True)

    class Meta:
        abstract = True


class Container(Node):
    container_type = models.IntegerField(choices=CONTAINER_TYPE_CHOICES, default=CONTAINER_TYPE_DEFAULT)
    metadata = JSONField(default={})

    @property
    def link(self):
        return f'/container/{self.id}'

    @property
    def type_verbose(self):
        return CONTAINER_TYPE_CHOICES[self.container_type]

    def __str__(self):
        return self.name

    def __repr__(self):
        return f'Container#{self.id}({self.name})'

    def clean(self):
        # Ensure there are no circular parents
        node = self
        while node.parent is not None:
            node = node.parent
            if node == self:
                raise ValidationError(
                    'Containers cannot be circularly contained within themselves... with current technology.')


class ItemTag(models.Model):
    name = models.CharField(verbose_name='name', max_length=30, primary_key=True)

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        return super().save(*args, **kwargs)

    @property
    def link(self):
        return f'/tag/{self.name}'

    def __str__(self):
        return self.name

    def __repr__(self):
        return f'ItemTag({self.name})'


class Item(Node):
    quantity = models.IntegerField('quantity', default=0)
    alert_quantity = models.IntegerField('alert quantity', default=0)
    source = models.CharField(verbose_name='source', max_length=200, blank=True, default='')
    source_url = models.URLField(verbose_name='source URL', blank=True, null=True)
    tags = models.ManyToManyField(ItemTag)

    @property
    def link(self):
        return f'/item/{self.id}'

    def __str__(self):
        return f'{self.name} × {self.quantity}'

    def __repr__(self):
        return f'Item#{self.id}({self.name})'


class ItemAttributeStr(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    attribute = models.CharField(max_length=30)
    value = models.TextField()

    class Meta:
        index_together = [('item', 'attribute')]


class ItemAttributeNum(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    attribute = models.CharField(max_length=30)
    value = models.FloatField()

    class Meta:
        index_together = [('item', 'attribute')]
