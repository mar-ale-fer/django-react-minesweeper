from datetime import datetime

from rest_framework.serializers import ModelSerializer, SerializerMethodField, HyperlinkedModelSerializer, ReadOnlyField

from .models import CustomUser
from .models import Game

class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'last_login', 'date_joined', 'is_staff')

class GameSerializer(HyperlinkedModelSerializer):
    start_str_ser = ReadOnlyField(source='start_str')
    class Meta:
        model = Game
        fields = ['id','useremail','rows','columns',
        'mines', 'state_time_elapsed', 'state_board',
        'start_str_ser','state']
    
