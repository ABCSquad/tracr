
from django.shortcuts import render, redirect

# Create your views here.
#----------------------------- HOME ------------------------------------#

def home(request):
    return render(request, 'main/home.html')


def app(request):
    return render(request, 'main/app.html')
