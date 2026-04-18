from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/register/', views.register, name='register'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    path('classes/', views.public_classes, name='public-classes'),
    path('trainers/', views.trainers_list, name='trainers-list'),

    path('book/', views.book_class, name='book-class'),
    path('my-bookings/', views.my_bookings, name='my-bookings'),
    path('cancel/<int:booking_id>/', views.cancel_booking, name='cancel-booking'),

    path('admin/classes/', views.AdminClassesView.as_view(), name='admin-classes'),
    path('admin/classes/<int:pk>/', views.AdminClassDetailView.as_view(), name='admin-class-detail'),
]