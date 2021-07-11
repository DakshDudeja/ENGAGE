from typing import ContextManager
from django.shortcuts import render

# Taking the url and passing the view controller to front

def main_view(request):  
    context = {}
    return render(request, 'chat/main.html' , context=context)