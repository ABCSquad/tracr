
from django.http.response import HttpResponse
from django.shortcuts import render, redirect
import regex as re
import pybase64 as base64
import io
import numpy as np
from PIL import Image
from main import equation
import json


# Create your views here.
#----------------------------- HOME ------------------------------------#

def convert_from_image_to_cv2(img: Image) -> np.ndarray:
    # return cv2.cvtColor(numpy.array(img), cv2.COLOR_RGB2BGR)
    return np.asarray(img)

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
        # bg.show()
        bg_opencv = convert_from_image_to_cv2(bg)
        try:
            res_img, equation_dict_list = equation.equation(bg_opencv)  
        except:
            equation_dict_list = [{
                'equation': 'Invalid',
                'result': 'Invalid',
                'latex': 'Invalid'
            }]
        return HttpResponse(json.dumps(equation_dict_list))     

    return render(request, 'main/app.html')

