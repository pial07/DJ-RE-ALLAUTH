from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from . manager import CustomUserManager
from django.utils.translation import gettext_lazy as _




class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("first name"), max_length=100)
    last_name = models.CharField(_("last name"), max_length=100)
    email = models.EmailField(_("email address"), max_length=254, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
      

    def __str__(self):
        return self.email
    
    @property
    def username(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
