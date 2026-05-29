from django.contrib import admin
from backend.ecole.models import Filiere, Classe


@admin.register(Filiere)
class FiliereAdmin(admin.ModelAdmin):
    list_display = ('nom', 'active', 'created_at')
    search_fields = ('nom',)


@admin.register(Classe)
class ClasseAdmin(admin.ModelAdmin):
    list_display = ('nom', 'filiere', 'niveau', 'enseignant_responsable', 'active')
    list_filter = ('filiere', 'active')
    search_fields = ('nom', 'niveau')
