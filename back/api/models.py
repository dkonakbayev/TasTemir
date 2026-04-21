from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return f'{self.user.username} ({self.role})'

class Trainer(models.Model):
    name = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255)
    experience = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class FitnessClass(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    datetime = models.DateTimeField()
    capacity = models.PositiveIntegerField()
    direction = models.CharField(max_length=100)
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name='classes')

    class Meta:
        verbose_name_plural = 'Fitness classes'

    def __str__(self):
        return f'{self.title} — {self.direction}'


class BookingManager(models.Manager):
    def active(self):
        return self.get_queryset().filter(status='booked')


class Booking(models.Model):
    objects = BookingManager()

    STATUS_CHOICES = (
        ('booked', 'Booked'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    fitness_class = models.ForeignKey(FitnessClass, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'fitness_class', 'status')

    def __str__(self):
        return f'{self.user.username} → {self.fitness_class.title} ({self.status})'