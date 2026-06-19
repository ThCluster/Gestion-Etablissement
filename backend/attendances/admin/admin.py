from django.contrib import admin
from backend.attendances.models import Attendance

@admin.register(Attendance)
class AttendancesAdmin(admin.ModelAdmin):
    list_display = ("utilisateur","classe","date","statut","justifie")
    list_filter = ("statut","justifie","date","classe")
    # search_fields = ("utilisateur__username","motif") #permet la liaison 
