from rest_framework import permissions

from backend.comptes.models import Role


class ReadOnlyOrStaff(permissions.BasePermission):
    """GET autorisé pour tout utilisateur authentifié ; écriture réservée au staff."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        if user.is_superuser:
            return True
        return getattr(user, 'role', None) in (Role.ADMIN, Role.ENSEIGNANT)
