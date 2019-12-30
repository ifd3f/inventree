from django import forms


class ItemForm(forms.Form):
    name = forms.CharField(label='Name', max_length=100)
