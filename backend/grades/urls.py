from rest_framework.routers import DefaultRouter
from backend.grades.viewsets import MatiereViewSet, NoteViewSet

router = DefaultRouter()
router.register(r'matieres', MatiereViewSet, basename='matieres')
router.register(r'notes', NoteViewSet, basename='notes')

urlpatterns = router.urls