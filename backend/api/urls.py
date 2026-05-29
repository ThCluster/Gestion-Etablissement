from rest_framework.routers import DefaultRouter

from backend.comptes.viewsets import (
    UtilisateurViewSet,
    InscriptionViewSet,
    LoginViewSet
)

from backend.ecole.viewsets import FiliereViewSet, ClasseViewSet
from backend.finance.viewsets import PaiementViewSet, RecuViewSet
from backend.attendances.viewsets import AttendanceViewSet
from backend.grades.viewsets import MatiereViewSet, NoteViewSet


router = DefaultRouter()

# USERS
router.register(r'utilisateurs', UtilisateurViewSet, basename='utilisateurs')

# AUTH
router.register(r'inscriptions', InscriptionViewSet, basename='inscriptions')
router.register(r'login', LoginViewSet, basename='login')

# ECOLE
router.register(r'filieres', FiliereViewSet, basename='filieres')
router.register(r'classes', ClasseViewSet, basename='classes')

# FINANCE
router.register(r'paiements', PaiementViewSet, basename='paiements')
router.register(r'recus', RecuViewSet, basename='recus')

# ATTENDANCE
router.register(r'absences', AttendanceViewSet, basename='absences')

# GRADES
router.register(r'matieres', MatiereViewSet, basename='matieres')
router.register(r'notes', NoteViewSet, basename='notes')


urlpatterns = router.urls