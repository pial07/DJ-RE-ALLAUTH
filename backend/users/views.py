import requests
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from django.contrib.auth.views import PasswordResetView
from django.conf import settings
from .models import User
from . models import User
from .serializers import UserSerializer
from rest_framework.views import APIView
from allauth.account.utils import send_email_confirmation

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    """
    Google OAuth2 callback handling
    """
    token = request.data.get('token')

    if not token:
        return Response({'error': 'No token provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get user info using the access token
        user_info_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token}'}
        )

        # Check if the request was successful
        if user_info_response.status_code != 200:
            return Response({'error': 'Invalid Google token.'}, status=status.HTTP_400_BAD_REQUEST)

        # Extract user data
        google_data = user_info_response.json()
        email = google_data.get('email')
        
        if not email:
            return Response({'error': 'Google token missing email.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find or create the user - with compatibility for different User models
        # First check the fields on the User model
        user_fields = [field.name for field in User._meta.get_fields()]
        
        # Prepare defaults based on available fields
        defaults = {}
        
        if 'first_name' in user_fields:
            defaults['first_name'] = google_data.get('given_name', '')
        
        if 'last_name' in user_fields:
            defaults['last_name'] = google_data.get('family_name', '')
        
        if 'username' in user_fields:
            defaults['username'] = email.split('@')[0]
        
        # Find or create the user
        user, created = User.objects.get_or_create(
            email=email, 
            defaults=defaults
        )

        # Issue app access token
        refresh = RefreshToken.for_user(user)

        # Create response data
        response_data = {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'email': user.email,
            }
        }
        
        # Add optional user fields if they exist
        if hasattr(user, 'username'):
            response_data['user']['username'] = user.username
        
        if hasattr(user, 'first_name'):
            response_data['user']['first_name'] = user.first_name
            
        if hasattr(user, 'last_name'):
            response_data['user']['last_name'] = user.last_name
            
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password1 = request.data.get('new_password1')
    new_password2 = request.data.get('new_password2')

    if not uid or not token or not new_password1 or not new_password2:
        return Response({"detail": "Missing fields."}, status=status.HTTP_400_BAD_REQUEST)

    if new_password1 != new_password2:
        return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        uid = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"detail": "Invalid UID."}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password1)
    user.save()

    return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)

# ✅ Register API
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        send_email_confirmation(self.request, user)

# ✅ Login API
class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

# ✅ Logout API
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

class CustomPasswordResetView(PasswordResetView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Frontend link format:
        # e.g. http://localhost:5173/password-reset-confirm/<uid>-<token>
        uid = context.get('uid')
        token = context.get('token')
        if uid and token:
            reset_link = f"{settings.FRONTEND_URL}/password-reset-confirm/{uid}-{token}"
            context['reset_link'] = reset_link
        return context