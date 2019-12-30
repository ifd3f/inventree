from collections import namedtuple

from django import forms
from django.db.models import Q, F

from inventory.models import Item, Container


SearchResult = namedtuple('SearchResult', 'name link type description parent')


class SearchForm(forms.Form):
    search_keyword = forms.CharField(label='keyword')

    def get_results(self):
        items_query = (
            Item.objects.filter(Q(name__contains=self.cleaned_data['search_keyword']))
        )
        item_results = [
            SearchResult(str(i), i.link, 'Item', i.description, i.parent)
            for i in items_query
        ]
        container_query = (
            Container.objects.filter(name__contains=self.cleaned_data['search_keyword'])
        )
        container_results = [
            SearchResult(c.name, c.link, f'Container ({c.type_verbose})', c.description, c.parent)
            for c in container_query
        ]
        return item_results + container_results


# class ItemForm(forms.Form):
#     name = forms.CharField(label='Name', max_length=100)
#     description = forms.TextField('description', blank=True)
#     quantity = forms.IntegerField('quantity', default=0)
#     alert_quantity = forms.IntegerField('alert quantity', default=0)

