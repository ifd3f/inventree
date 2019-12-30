from django.contrib import admin
from .models import Container, ItemTag, Item

# Register your models here.
@admin.register(Container, ItemTag, Item)
class AuthorAdmin(admin.ModelAdmin):
    pass
