from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('rag_app.urls')),  # Include URLs from the rag_app app
]
