from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from backend.comptes.models import Utilisateur


class UtilisateurAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Informations Supplémentaires', {'fields': ('role', 'telephone', 'photo', 'parent')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations Supplémentaires', {'fields': ('role', 'telephone', 'photo', 'parent')}),
    )
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'parent', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_superuser', 'is_active']


admin.site.register(Utilisateur, UtilisateurAdmin)