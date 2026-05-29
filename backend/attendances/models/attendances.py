from django.db import models
from backend.base.models import StandardModel
from django.conf import settings
from backend.ecole.models import Classe

class StatutAbsence(models.TextChoices):
    PRESENT = 'present', 'Présent'
    ABSENT = 'absent', 'Absent'
    RETARD = 'retard', 'En retard'
    EXCUSE = 'excuse', 'Excusé'

class Attendance(StandardModel):
    class Meta:
        ordering = ['-created_at']

    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='absences'
    )
    classe = models.ForeignKey(
        Classe,
        on_delete=models.CASCADE,
        related_name='absences'
    )
    date = models.DateField()
    statut = models.CharField(
        max_length=20,
        choices=StatutAbsence.choices,
        default=StatutAbsence.PRESENT
    )
    motif = models.TextField(blank=True)
    justifie = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.utilisateur} - {self.date} ({self.statut})"