from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

# HOME

def home(request):
    return HttpResponse('Hello')