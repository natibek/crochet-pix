from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

context = {
    "dims": {
        "width": 10,
        "height": 10,
    },

    "pixels": [(ind, {"r":ind % 255, "g":ind%100, "b":ind%50}) for ind in range(10*10)]
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

