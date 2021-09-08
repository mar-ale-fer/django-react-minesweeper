from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from .models import CustomUser, Game
from .serializers import UserSerializer, GameSerializer
from rest_framework import viewsets

class UserListView(ListAPIView):    
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated] #[IsAdminUser]

class GameViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Games to be viewed or edited.
    """
    
    queryset = Game.objects.filter(id =3)
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print(user)
        queryset = Game.objects.filter(useremail=user)
        # if user is not None:
        #     queryset = queryset.filter(courses__owner_id=user.id)
        return queryset