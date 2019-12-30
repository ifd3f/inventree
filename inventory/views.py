from django.db.models import Sum, Count, F
from django.http import HttpResponse
from django.template import loader

from inventory.forms import SearchForm
from inventory.models import Item, Container


def search(request):
    form = SearchForm(request.GET)
    if form.is_valid():

        template = loader.get_template('search.html')
        context = {
            'items': Item.objects.annotate(total_count=Sum('quantity')),
            'containers': Container.objects,
            'results': form.get_results()
        }
        return HttpResponse(template.render(context, request))


def index(request):
    template = loader.get_template('index.html')
    restock_query = Item.objects.all().filter(quantity__lte=F('alert_quantity'))
    context = {
        'items': Item.objects.annotate(total_count=Sum('quantity')),
        'containers': Container.objects,
        'restock_items': restock_query
    }
    print(context)
    return HttpResponse(template.render(context, request))


def add(request):
    template = loader.get_template('add.html')
    return HttpResponse(template.render(context, request))

