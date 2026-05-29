# comptes/urls.py
# Note : ce fichier est conservé mais les routes principales passent par api/urls.py.
# Le router ici enregistre /comptes/ comme alias de /utilisateurs/.
from rest_framework.routers import DefaultRouter
from backend.comptes.viewsets.comptes import UtilisateurViewSet

router = DefaultRouter()
router.register(r"comptes", UtilisateurViewSet, basename="comptes")

urlpatterns = router.urls