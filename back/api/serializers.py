from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import Trainer, FitnessClass, Booking, Profile

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        try:
            token['role'] = user.profile.role
        except Profile.DoesNotExist:
            token['role'] = 'user'
        return token

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=['user', 'admin'], default='user')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def create(self, validated_data):
        role = validated_data.pop('role', 'user')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        user.profile.role = role
        user.profile.save()
        return user

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

class FitnessClassSerializer(serializers.ModelSerializer):
    trainer_name = serializers.CharField(source='trainer.name', read_only=True)
    booked_count = serializers.SerializerMethodField()

    def get_booked_count(self, obj):
        return obj.bookings.filter(status='booked').count()

    class Meta:
        model = FitnessClass
        fields = ['id', 'title', 'description', 'datetime', 'capacity',
                  'direction', 'hall', 'trainer', 'trainer_name', 'booked_count']

class BookingSerializer(serializers.ModelSerializer):
    class_title = serializers.CharField(source='fitness_class.title', read_only=True)
    class_direction = serializers.CharField(source='fitness_class.direction', read_only=True)
    class_datetime = serializers.DateTimeField(source='fitness_class.datetime', read_only=True)
    class_hall = serializers.CharField(source='fitness_class.hall', read_only=True)
    class_trainer = serializers.CharField(source='fitness_class.trainer.name', read_only=True)
    class_description = serializers.CharField(source='fitness_class.description', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'fitness_class', 'status', 'created_at',
                  'class_title', 'class_direction', 'class_datetime', 'class_hall', 'class_trainer', 'class_description']
        read_only_fields = ['id', 'status', 'created_at']