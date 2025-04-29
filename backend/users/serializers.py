from django.contrib.auth import get_user_model

from rest_framework import serializers


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = { 'password': {'write_only': True}}



# class CreateUserSerializer(UserCreateSerializer):
#     class Meta(UserCreateSerializer.Meta):
#         model = User
#         fields = ['id', 'email', 'first_name', 'last_name', 'password']