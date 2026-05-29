from rest_framework.routers import DefaultRouter
from backend.register.viewsets import InscriptionViewSet

router = DefaultRouter()
router.register(r'inscriptions', InscriptionViewSet, basename='inscriptions')

urlpatterns = router.urls