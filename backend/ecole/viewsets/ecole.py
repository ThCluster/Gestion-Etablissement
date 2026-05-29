from rest_framework import viewsets
from backend.ecole.models import Filiere, Classe
from backend.ecole.serializers import FiliereSerializer, ClasseSerializer
from backend.comptes.models import Role
from backend.comptes.permissions import ReadOnlyOrStaff
from backend.comptes.scope import classe_ids_pour_enseignant, filiere_ids_pour_enseignant


class FiliereViewSet(viewsets.ModelViewSet):
    serializer_class = FiliereSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_queryset(self):
        qs = Filiere.objects.filter(active=True)
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_superuser or getattr(user, 'role', None) == Role.ADMIN:
            return qs
        if getattr(user, 'role', None) == Role.ENSEIGNANT:
            fids = filiere_ids_pour_enseignant(user)
            if fids is None:
                return qs.none()
            return qs.filter(pk__in=fids) if fids else qs.none()
        return qs.none()


class ClasseViewSet(viewsets.ModelViewSet):
    serializer_class = ClasseSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_queryset(self):
        qs = Classe.objects.filter(active=True)
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_superuser or getattr(user, 'role', None) == Role.ADMIN:
            return qs
        if getattr(user, 'role', None) == Role.ENSEIGNANT:
            cids = classe_ids_pour_enseignant(user)
            if cids is None:
                return qs.none()
            return qs.filter(pk__in=cids) if cids else qs.none()
        return qs.none()
