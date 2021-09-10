from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    def __str__(self):
        return self.email


class Game (models.Model):
    #states of a game
    NOT_STARTED = 'NOT_STARTED' 
    STARTED = 'STARTED' 
    WON = 'WON'
    LOST = 'LOST' 
    STATE = (
        (NOT_STARTED, 'Not started'),
        (STARTED, 'Started'),
        (WON, 'Won'),
        (LOST, 'Lost'),
    )

    useremail= models.CharField('User', max_length= 256, default='')
    rows = models.SmallIntegerField('Rows',default=0)
    columns = models.SmallIntegerField('Columns',default=0)
    start = models.DateTimeField(auto_now_add=True)
    mines = models.SmallIntegerField('Mines',default=0)
    state_time_elapsed = models.IntegerField('Time elapsed', default= 0)
    state_board = models.TextField('json', default = '[]') #the gameplay at a specific time
    state = models.CharField('State',max_length=11, choices=STATE, default=NOT_STARTED)

    def __str__(self):
        return f'({self.id}) user:{self.useremail} rows: {self.rows} columns: {self.columns} mines:{self.mines} start: {self.start} status:{self.state}'
    @property
    def start_str(self):
        return f'{self.start.strftime("%m/%d/%Y, %H:%M")}'