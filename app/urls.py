from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("image_upload", views.image_upload, name="image_upload"),
    path("open_design", views.open_design, name="open_design"),
    path("save_design", views.save_design, name="save_design"),
    path("download_img", views.download_img, name="download_img"),
    path("show_info", views.show_info, name="show_info"),
    path("resize_img", views.resize_img, name="resize_img"),
    path("reset_img", views.reset_img, name="reset_img"),
]