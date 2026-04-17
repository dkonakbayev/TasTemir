from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import FitnessClass, Booking, Trainer
from .serializers import FitnessClassSerializer, BookingSerializer, TrainerSerializer

from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
# Create your views here.

@api_view(['GET'])
def public_classes(request):
    classes = FitnessClass.objects.all()
    serializer = FitnessClassSerializer(classes , many = True)
    return Response(serializer.data)

@api_view(['GET'])
def trainers_list(request):
    trainers = Trainer.objects.all()
    serializer = TrainerSerializer(trainers , many = True)
    return Response(serializer.data)


@api_view(['POST'])
def register(request):
    from django.contrib.auth.models import User

    username = request.data['username']
    password = request.data['password']

    user = User.objects.create_user(username=username, password=password)

    return Response({"message": "User created"})


@api_view(['POST'])
def login(request):
    user = authenticate(
        username = request.POST['username'],
        password = request.POST['password']
    )

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            "access" : str(refresh.access_token),
            "refresh" : str(refresh)
        })

    return Response({"error" : "Invalid credentials"})


#user
@api_view(['POST'])
def book_class(request):
    serializer = BookingSerializer(data = request.data)

    if serializer.is_valid():
        fitness_class_id = serializer.validated_data['fitness_class']
        fitness_class = FitnessClass.objects.get(id = fitness_class_id)

        if Booking.objects.filter(fitness_class = fitness_class , status = 'booked').count() >= fitness_class.capacity:
            return Response({"error" : "No slots available"})

        Booking.objects.create(
            user = request.user,
            fitness_class = fitness_class
        )

        return Response({"message" : "booked"})

    return Response({serializer.errors})


@api_view(['GET'])
def my_bookings(request):
    bookings = Booking.objects.filter(user = request.user)
    data = [
        {
            "id" : b.id,
            "class" : b.fitness_class,
            "status" : b.status
        }for b in bookings
    ]
    return Response(data)


@api_view(['POST'])
def cancel_bookings(request , booking_id):
    booking = Booking.objects.get(id = booking_id , user = request.user)
    booking.status = 'canceled'
    booking.save()

    return Response({"message" : "Cancelled"})


#admin

class AdminClassesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self , request):
        classes = FitnessClass.objects.all()
        serializer = FitnessClassSerializer(classes , many = True)
        return Response(serializer.data)

    def post(self , request):
        serializer = FitnessClassSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class AdminClassDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self , request , pk):
        fitness_class = FitnessClass.objects.get(id = pk)
        serializer = FitnessClassSerializer(fitness_class , data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


    def delete(self , request , pk):
        fitness_class = FitnessClass.objects.get(id = pk)
        fitness_class.delete()
        return Response({"message" : "Deleted"})





