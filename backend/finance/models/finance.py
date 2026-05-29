from django.db import models
from backend.base.models import StandardModel
from django.conf import settings

# Create your models here.

class TypePaiement(models.TextChoices):
    SCOLARITE = 'scolarite', 'Scolarité'
    INSCRIPTION = 'inscription', 'Inscription'
    CANTINE = 'cantine', 'Cantine'
    TRANSPORT = 'transport', 'Transport'
    AUTRE = 'autre', 'Autre'

class StatutPaiement(models.TextChoices):
    EN_ATTENTE = 'en_attente', 'En attente'
    PAYE = 'paye', 'Payé'
    ANNULE = 'annule', 'Annulé'

class Paiement(StandardModel):
    class Meta:
        ordering = ['-created_at']

    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='paiements'
    )
    type_paiement = models.CharField(
        max_length=20,
        choices=TypePaiement.choices,
        default=TypePaiement.SCOLARITE
    )
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    statut = models.CharField(
        max_length=20,
        choices=StatutPaiement.choices,
        default=StatutPaiement.EN_ATTENTE
    )
    date_paiement = models.DateField(null=True, blank=True)
    reference = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.utilisateur} - {self.montant} ({self.statut})"

class Recu(StandardModel):
    paiement = models.OneToOneField(
        Paiement,
        on_delete=models.CASCADE,
        related_name='recu'
    )
    numero_recu = models.CharField(max_length=50, unique=True)
    date_emission = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Reçu {self.numero_recu} - {self.paiement}"