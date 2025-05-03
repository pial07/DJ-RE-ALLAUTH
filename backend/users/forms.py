from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import User

from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth import get_user_model
from allauth.account.forms import ResetPasswordForm



class CustomResetPasswordForm(ResetPasswordForm):
    def save(self, request):
        email = self.cleaned_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None  # Optional: silently ignore if user not found

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = f"http://localhost:5173/password/reset/confirm/{uid}/{token}/"

        # Now send your custom email
        subject = "Password Reset Requested"
        message = f"Hello,\n\nYou requested a password reset. Please click the link below to reset your password:\n\n{reset_url}\n\nIf you did not request this, please ignore this email."
        from_email = "your-email@example.com"
        recipient_list = [email]

        send_mail(subject, message, from_email, recipient_list)

        return None


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ["email", "first_name", "last_name"]
        error_class = "error"

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = ["email", "first_name", "last_name"]
        error_class = "error"

