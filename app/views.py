from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import *

DEFAULT_WIDTH = 20
DEFAULT_HEIGHT = 20

DEFAULT_CONTEXT = {
    "dims": {
        "width": DEFAULT_WIDTH,
        "height": DEFAULT_HEIGHT,
    },

    "pixels": [(ind, {"r":ind % 255, "g":ind%100, "b":ind%50}) for ind in range(DEFAULT_HEIGHT*DEFAULT_WIDTH)],
    "right": make_right(DEFAULT_HEIGHT),
    "left": make_left(DEFAULT_HEIGHT),
    "horizontal":make_horizontal(DEFAULT_WIDTH)
}

@csrf_exempt
def index(request):
    if not request.session.get("context", None):
        request.session["context"] = DEFAULT_CONTEXT
    
    context = request.session.get("context")
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
    # clean up the string input
    print("Resizing Image")
    new_width = request.POST.get("new_width")
    new_height = request.POST.get("new_height")
    context = request.session.get("context")

    if not new_height or not new_width:
        return redirect("/app")

    old_width = context["dims"]["width"]
    old_height = context["dims"]["height"]

    if new_height == old_height and new_width == old_width:
        return redirect("/app")

    new_height = int(new_height)
    new_width = int(new_width)

    size_diff = (new_height*new_width) - (old_height*old_width)

    print(f"{new_height=}, {new_width=}")
    print(f"{old_height=}, {old_width=}")
    print(f"{size_diff=}")
    if size_diff <= 0:
        context["pixels"] = context["pixels"][:new_height*new_width] 
    else:
        for ind in range(size_diff):
            context["pixels"].append((ind + (old_height*old_width), {"r": 255, "g": 255, "b": 255}))
        print("New len: ", len(context["pixels"]), "new dim product: ", new_height*new_width)

    context["dims"]["width"] = new_width
    context["dims"]["height"] = new_height
    context["right"] = make_right(new_height)
    context["left"] = make_left(new_height)
    context["horizontal"] = make_horizontal(new_width)
    request.session["context"] = context

    return redirect("/app")

@csrf_exempt
def reset_img(request):
    request.session["context"] = DEFAULT_CONTEXT
    return redirect("/app")
