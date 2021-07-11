from django.urls import path
from .views import main_view

#creating an url view for the route

urlpatterns = [
    path('',main_view,name='main_view'), 
]
