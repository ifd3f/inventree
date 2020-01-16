import uuid

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from jsonfield import JSONField

CONTAINER_TYPE_DEFAULT = 0
"""
Specifies a container that has no defined structure. The contents are rendered as a table.

container_metadata = {}

child location_metadata schema:
    
    - location: str -> a description of its location in the container
"""

CONTAINER_TYPE_GRID = 1
"""
Specifies a container with a grid structure. The container has an integer number of rows and columns. Each child of the 
container occupies a cell in the grid, and there can be multiple children in a single cell. There is a special cell
outside of the grid specifying unsorted children.

container_metadata schema: 
    
    - rows: int
    - cols: int

child location_metadata schema:

    - position: null | {x: int, y: int} -> null means unsorted, object means sorted
"""

CONTAINER_TYPE_FREEFORM = 2
"""
Specifies a container with a non-gridlike structure. The container has a real width and height. Each child has a shape 
and an (x, y) position inside the container, or it is unsorted.

container_metadata schema:
    
    - width: float
    - height: float

child location_metadata schema:

    - shape: {type: str, ...} -> type specifies the type of the object.
    - pos: null | {x: float, y: float} -> where it is, or null if unsorted.  
"""

CONTAINER_TYPE_CHOICES = [
    (CONTAINER_TYPE_DEFAULT, 'default'),
    (CONTAINER_TYPE_GRID, 'grid'),
    (CONTAINER_TYPE_FREEFORM, 'freeform')
]


class Node(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='container/', blank=True, null=True)

    parent = models.ForeignKey('Container', on_delete=models.SET_NULL, blank=True, null=True)
    location_metadata = JSONField(default={}, blank=True)
    """
    Used for custom positioning.
    """

    qr_uuid = models.UUIDField(default=uuid.uuid1, db_index=True)
    """
    This is the UUID that will be used to universally identify this object, no matter what inventory system it's 
    attached to. It is initialized to a default value, but it can be changed to any value you want. 
    
    There are 2 ways to use QR UUIDs:

    - **Use the default UUID:** Print out the default sticker, and stick it on the object, then you're done.
    - **Use a UUID from a sheet:** The server can generate sheets of multiple unassociated stickers. Every time you 
    put a sticker on an object, you scan it to register the item's new UUID. 
    """

    @property
    def qr_uri(self):
        return f'unrefined-stockpile-qr:{self.qr_uuid}'

    class Meta:
        abstract = True


class Container(Node):
    container_type = models.IntegerField(choices=CONTAINER_TYPE_CHOICES, default=CONTAINER_TYPE_DEFAULT)
    """
    """

    metadata = JSONField(default={})

    @property
    def link(self):
        return f'/container/{self.id}'

    @property
    def type_verbose(self):
        return CONTAINER_TYPE_CHOICES[self.container_type]

    @property
    def resource_path(self):
        return f'/container/{self.id}'

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
    name = models.CharField(max_length=100)
    quantity = models.IntegerField('quantity', default=0, validators=[MinValueValidator(0)])
    alert_quantity = models.IntegerField('alert quantity', default=0, validators=[MinValueValidator(-1)])
    source = models.CharField(verbose_name='source', max_length=200, blank=True, default='')
    source_url = models.URLField(verbose_name='source URL', blank=True, null=True)
    tags = models.ManyToManyField(ItemTag, blank=True)

    @property
    def link(self):
        return f'/item/{self.id}'

    @property
    def resource_path(self):
        return f'/item/{self.id}'

    @property
    def tags_string(self):
        return ','.join(tag.name for tag in self.tags.all())

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


class Project(models.Model):
    name = models.CharField(max_length=100)
    used_items = models.ManyToManyField(Item, through='ItemUsage')


class ItemUsage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    is_reusable = models.BooleanField()
    notes = models.TextField()
