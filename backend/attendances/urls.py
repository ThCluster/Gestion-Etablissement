from rest_framework.routers import DefaultRouter
from backend.attendances.viewsets import AttendanceViewSet

router = DefaultRouter()
router.register(r'absences', AttendanceViewSet, basename='absences')

urlpatterns = router.urls