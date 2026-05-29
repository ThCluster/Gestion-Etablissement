from rest_framework import viewsets
from backend.register.models import Inscription
from backend.register.serializers import InscriptionSerializer
from backend.comptes.models import Role
from backend.comptes.permissions import ReadOnlyOrStaff
from backend.comptes.scope import classe_ids_pour_enseignant


class InscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = InscriptionSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_queryset(self):
        qs = Inscription.objects.filter(active=True)
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_superuser or getattr(user, 'role', None) == Role.ADMIN:
            return qs
        if getattr(user, 'role', None) == Role.ENSEIGNANT:
            cids = classe_ids_pour_enseignant(user)
            if cids is None:
                return qs.none()
            return qs.filter(classe_id__in=cids) if cids else qs.none()
        if getattr(user, 'role', None) == Role.ELEVE:
            return qs.filter(utilisateur=user)
        return qs.none()
