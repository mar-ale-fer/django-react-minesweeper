from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    def __str__(self):
        return self.email


class Game (models.Model):
    useremail= models.CharField('User', max_length= 256, default='')
    rows = models.SmallIntegerField('Rows',default=0)
    columns = models.SmallIntegerField('Columns',default=0)
    start = models.DateTimeField(auto_now_add=True)
    mines = models.SmallIntegerField('Mines',default=0)
    state_time_elapsed = models.IntegerField('Time elapsed', default= 0)
    state_board = models.TextField('json', default = '[]')
    def __str__(self):
        return f'({self.id}) user:{self.useremail} rows: {self.rows} columns: {self.columns} mines:{self.mines} start: {self.start}'
    @property
    def start_str(self):
        return f'{self.start}'