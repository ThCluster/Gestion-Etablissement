from rest_framework.routers import DefaultRouter
from backend.finance.viewsets import PaiementViewSet, RecuViewSet

router = DefaultRouter()
router.register(r'paiements', PaiementViewSet, basename='paiements')
router.register(r'recus', RecuViewSet, basename='recus')

urlpatterns = router.urls