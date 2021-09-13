from django.urls import include, path

from .views import UserListView, GameViewSet

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'games', GameViewSet)

urlpatterns = [
    path('', UserListView.as_view()),
    #path('game/', GameListView.as_view()),
    path('', include(router.urls)),
    path('auth/', include('rest_auth.urls')),
    path('auth/register/', include('rest_auth.registration.urls')),
]
