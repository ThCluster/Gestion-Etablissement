from rest_framework import viewsets
from backend.grades.models import Matiere, Note
from backend.grades.serializers import MatiereSerializer, NoteSerializer
from backend.comptes.models import Role
from backend.comptes.permissions import ReadOnlyOrStaff
from backend.comptes.scope import classe_ids_pour_enseignant, eleve_ids_pour_enseignant


class MatiereViewSet(viewsets.ModelViewSet):
    serializer_class = MatiereSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_queryset(self):
        qs = Matiere.objects.filter(active=True)
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
            from backend.register.models import Inscription

            cc = list(
                Inscription.objects.filter(utilisateur=user, active=True).values_list(
                    'classe_id', flat=True
                )
            )
            return qs.filter(classe_id__in=cc) if cc else qs.none()
        return qs.none()


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_queryset(self):
        qs = Note.objects.filter(active=True)
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
