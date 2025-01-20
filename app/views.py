from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

DEFAULT_WIDTH = 20
DEFAULT_HEIGHT = 20

context = {
    "dims": {
        "width": DEFAULT_WIDTH,
        "height": DEFAULT_HEIGHT,
    },

    "pixels": [(ind, {"r":ind % 255, "g":ind%100, "b":ind%50}) for ind in range(DEFAULT_HEIGHT*DEFAULT_WIDTH)],
    "right": ["-" if i % 2 != 0 else i for i in range(DEFAULT_HEIGHT, 0, -1)],
    "left": [i if i % 2 != 0 else "-" for i in range(DEFAULT_HEIGHT, 0, -1)],
    "horizontal": range(DEFAULT_WIDTH, 0, -1)
}
def index(request):
    return render(request, "app/index.html", context=context)

@csrf_exempt
def image_upload(request):
    print("Image upload")
    return render(request, "app/crop.html")

@csrf_exempt
def open_design(request):
    print("Opening design")
    return render(request, "app/index.html")

@csrf_exempt
def save_design(request):
    print("Saving design")
    return render(request, "app/index.html")

@csrf_exempt
def download_img(request):
    print("Downloading image")
    return render(request, "app/index.html")

def show_info(request):
    print("Show info")
    return render(request, "app/info.html")

@csrf_exempt
def resize_img(request):



    return render(request, "app/index.html", context=context)

@csrf_exempt
def reset_img(request):
    context = {
        "dims": {
            "width": DEFAULT_WIDTH,
            "height": DEFAULT_HEIGHT,
        },
    
        "pixels": [(ind, {"r":255, "g":255, "b":255}) for ind in range(DEFAULT_WIDTH*DEFAULT_HEIGHT)],
        "right": ["-" if i % 2 != 0 else i for i in range(DEFAULT_HEIGHT, 0, -1)],
        "left": [i if i % 2 != 0 else "-" for i in range(DEFAULT_HEIGHT, 0, -1)],
        "horizontal": range(DEFAULT_WIDTH, 0, -1)
    }
    return render(request, "app/index.html", context=context)
