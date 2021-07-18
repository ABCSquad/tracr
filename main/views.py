
from django.http.response import HttpResponse
from django.shortcuts import render, redirect
import regex as re
import pybase64 as base64
import io
from PIL import Image


# Create your views here.
#----------------------------- HOME ------------------------------------#

def home(request):
    return render(request, 'main/home.html')


def app(request):
    if request.method=="POST":
        captured_image = request.POST['dataURL']
        imgstr = re.search('base64,(.*)', captured_image).group(1)
        imgstr = base64.b64decode(imgstr)
        #print(imgstr)
        tempimg = io.BytesIO(imgstr)
        im = Image.open(tempimg)
        #print(im)
        bg = Image.new("RGB", im.size, (255,255,255))
        bg.paste(im,im)
        # print(bg)
        success= 'received image'
        bg.show()
        return HttpResponse(success)
    
        
           

    return render(request, 'main/app.html')
