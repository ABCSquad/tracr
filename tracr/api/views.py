from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

# INDEX

def main(request):
    return HttpResponse('<h1>Hello</h1>')