from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    is_admin = models.BooleanField(default = False)


class Trainer(models.Model):
    name = models.CharField(max_length = 255)
    specialization = models.CharField(max_length = 255)
    description = models.TextField()


class FitnessClass(models.Model):
    title = models.CharField(max_length = 255)
    description = models.TextField()
    datetime = models.DateTimeField()
    capacity = models.IntegerField()
    direction = models.CharField(max_length = 100)
    trainer = models.ForeignKey(Trainer,on_delete = models.CASCADE)


class Booking(models.Model):
    STATUS_CHOICES = (
    ('booked' , 'Booked'),
    ('cancelled' , 'Cancelled'),
    )

    user = models.ForeignKey(User , on_delete = models.CASCADE)
    fitness_class = models.ForeignKey(FitnessClass , on_delete = models.CASCADE)
    status = models.CharField(max_length = 20 , choices = STATUS_CHOICES , default = 'booked')
    created_at = models.DateTimeField(auto_now_add = True)


