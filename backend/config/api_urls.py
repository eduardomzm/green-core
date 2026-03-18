from django.urls import path, include

urlpatterns = [
    path('', include('apps.users.urls')),
    path('', include('apps.reciclaje.urls')),
    path("users/", include("apps.users.urls")),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]
