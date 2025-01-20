from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, "app/nav.html")

@csrf_exempt
def image_upload(request):
    print("Image upload")
    return render(request, "app/nav.html")

@csrf_exempt
def open_design(request):
    print("Opening design")
    return render(request, "app/nav.html")

@csrf_exempt
def save_design(request):
    print("Saving design")
    return render(request, "app/nav.html")

@csrf_exempt
def download_img(request):
    print("Downloading image")
    return render(request, "app/nav.html")

