from django.contrib import admin
from .models import Profile, Trainer, FitnessClass, Booking


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)
    search_fields = ('user__username',)

@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'experience')
    search_fields = ('name', 'specialization')

@admin.register(FitnessClass)
class FitnessClassAdmin(admin.ModelAdmin):
    list_display = ('title', 'direction', 'trainer', 'datetime', 'capacity')
    list_filter = ('direction', 'trainer')
    search_fields = ('title',)
    ordering = ('-datetime',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'fitness_class', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'fitness_class__title')
    ordering = ('-created_at',)