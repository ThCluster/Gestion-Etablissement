from rest_framework import viewsets
from backend.finance.models import Paiement, Recu
from backend.finance.serializers import PaiementSerializer, RecuSerializer
from backend.comptes.models import Role
from backend.comptes.permissions import ReadOnlyOrStaff
from backend.comptes.scope import eleve_ids_pour_enseignant


class PaiementViewSet(viewsets.ModelViewSet):
    serializer_class = PaiementSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_queryset(self):
        qs = Paiement.objects.filter(active=True)
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_superuser or getattr(user, 'role', None) == Role.ADMIN:
            return qs
        if getattr(user, 'role', None) == Role.ENSEIGNANT:
            ids = eleve_ids_pour_enseignant(user)
            if ids is None:
                return qs.none()
            return qs.filter(utilisateur_id__in=ids) if ids else qs.none()
        if getattr(user, 'role', None) == Role.ELEVE:
            return qs.filter(utilisateur=user)
        if getattr(user, 'role', None) == Role.PARENT:
            return qs.filter(utilisateur__parent=user)
        return qs.none()


class RecuViewSet(viewsets.ModelViewSet):
    serializer_class = RecuSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_queryset(self):
        qs = Recu.objects.filter(active=True)
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_superuser or getattr(user, 'role', None) == Role.ADMIN:
            return qs
        if getattr(user, 'role', None) == Role.ENSEIGNANT:
            ids = eleve_ids_pour_enseignant(user)
            if ids is None:
                return qs.none()
            return qs.filter(paiement__utilisateur_id__in=ids) if ids else qs.none()
        if getattr(user, 'role', None) == Role.ELEVE:
            return qs.filter(paiement__utilisateur=user)
        if getattr(user, 'role', None) == Role.PARENT:
            return qs.filter(paiement__utilisateur__parent=user)
        return qs.none()
