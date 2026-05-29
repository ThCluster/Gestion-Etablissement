from rest_framework import viewsets
from backend.attendances.models import Attendance
from backend.attendances.serializers import AttendanceSerializer
from backend.comptes.models import Role
from backend.comptes.permissions import ReadOnlyOrStaff
from backend.comptes.scope import classe_ids_pour_enseignant, eleve_ids_pour_enseignant


class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [ReadOnlyOrStaff]

    def get_queryset(self):
        qs = Attendance.objects.filter(active=True)
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_superuser or getattr(user, 'role', None) == Role.ADMIN:
            return qs
        if getattr(user, 'role', None) == Role.ENSEIGNANT:
            cids = classe_ids_pour_enseignant(user)
            if cids is None:
                return qs.none()
            if not cids:
                return qs.none()
            eids = eleve_ids_pour_enseignant(user)
            return qs.filter(classe_id__in=cids, utilisateur_id__in=eids)
        if getattr(user, 'role', None) == Role.ELEVE:
            return qs.filter(utilisateur=user)
        if getattr(user, 'role', None) == Role.PARENT:
            return qs.filter(utilisateur__parent=user)
        return qs.none()
