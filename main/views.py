
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
        # print("-------",request.POST)
        if request.POST.get('captured_image'):
            captured_image = request.POST.get('captured_image')
            imgstr = re.search('base64,(.*)', captured_image).group(1)
            imgstr = base64.b64decode(imgstr)
            # print(imgstr)
            tempimg = io.BytesIO(imgstr)
            im = Image.open(tempimg)
            bg = Image.new("RGB", im.size, (255,255,255))
            bg.paste(im,im)
            bg.show()

    return render(request, 'main/app.html')
