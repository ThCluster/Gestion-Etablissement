# register/models/register.py
from django.db import models
from backend.base.models import StandardModel
from django.conf import settings
from backend.ecole.models import Classe

class Inscription(StandardModel):
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='inscriptions'
    )
    classe = models.ForeignKey(
        Classe,
        on_delete=models.CASCADE,
        related_name='inscriptions'
    )
    annee_scolaire = models.CharField(max_length=9)
    date_inscription = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.utilisateur} - {self.classe} ({self.annee_scolaire})"