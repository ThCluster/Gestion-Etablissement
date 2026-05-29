# ecole/models/ecole.py
from django.conf import settings
from django.db import models
from backend.base.models import StandardModel

class Filiere(StandardModel):
    class Meta:
        ordering = ['nom']
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.nom

class Classe(StandardModel):
    class Meta:
        ordering = ['nom']
    nom = models.CharField(max_length=50)
    filiere = models.ForeignKey(
        Filiere,
        on_delete=models.CASCADE,
        related_name='classes'
    )
    niveau = models.CharField(max_length=50)
    capacite = models.PositiveIntegerField(default=30)
    enseignant_responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='classes_responsables',
    )

    def __str__(self):
        return f"{self.nom} - {self.filiere}"