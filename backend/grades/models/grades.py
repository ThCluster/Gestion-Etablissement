from django.db import models
from backend.base.models import StandardModel
from django.conf import settings
from backend.ecole.models import Classe


class Matiere(StandardModel):
    nom = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    coefficient = models.PositiveIntegerField(default=1)
    classe = models.ForeignKey(
        Classe,
        on_delete=models.CASCADE,
        related_name='matieres'
    )
    enseignant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='matieres_enseignees',
        limit_choices_to={'role': 'enseignant'}
    )

    def __str__(self):
        return f"{self.nom} ({self.code})"

class Note(StandardModel):
    class Meta:
        ordering = ['-created_at']

    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    matiere = models.ForeignKey(
        Matiere,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    note = models.DecimalField(max_digits=5, decimal_places=2)
    note_max = models.DecimalField(max_digits=5, decimal_places=2, default=20)
    commentaire = models.TextField(blank=True)
    date_evaluation = models.DateField()

    def __str__(self):
        return f"{self.utilisateur} - {self.matiere} : {self.note}/{self.note_max}"