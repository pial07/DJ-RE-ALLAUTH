from django.urls import path
from .views import RegisterView, LoginView, LogoutView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from allauth.account.views import (
    PasswordResetView,
    PasswordResetFromKeyView
)
from .views import CustomPasswordResetView, password_reset_confirm, google_login_view
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('password/reset/', PasswordResetView.as_view(), name='account_reset_password'),  # 📩 Send reset email
    path('password/reset/key/', PasswordResetFromKeyView.as_view(), name='account_reset_password_from_key'),  
    path('password/reset/', CustomPasswordResetView.as_view(), name='account_reset_password'),
    path('password/reset/confirm/', password_reset_confirm, name='password_reset_confirm'),
    path('auth/google/', google_login_view, name='google-login'),

]
