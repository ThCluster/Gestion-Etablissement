from rest_framework.routers import DefaultRouter
from backend.ecole.viewsets import FiliereViewSet, ClasseViewSet

router = DefaultRouter()
router.register(r'filieres', FiliereViewSet, basename='filieres')
router.register(r'classes', ClasseViewSet, basename='classes')

urlpatterns = router.urls