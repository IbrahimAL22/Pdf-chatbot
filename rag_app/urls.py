from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_pdf, name='upload_pdf'),
    path('handle_query/', views.handle_query, name='handle_query'),
    path('', views.chat, name='chat'),
]
