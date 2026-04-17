from django.urls import path
from . import views

urlpatterns = [
    #pulic
    path('classes/', views.public_classes),
    path('trainers/' , views.trainers_list),


    #auth
    path('register/' , views.register),
    path('login/' , views.login),


    #user
    path('book/' , views.book_class),
    path('my-bookings/' , views.my_bookings),
    path('cancel/<int:booking_id>/' , views.cancel_bookings),


    #admin
    path('admin/classes/' , views.AdminClassesView.as_view()),
    path('admin/classes/<int:pk>/' , views.AdminClassDetailView.as_view()),

]