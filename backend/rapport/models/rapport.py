from django.db import models
from backend.base.models import StandardModel
from django.conf import settings

class TypeDocument(models.TextChoices):
    BULLETIN = 'bulletin', 'Bulletin de notes'
    CERTIFICAT = 'certificat', 'Certificat de scolarité'
    RECU = 'recu', 'Reçu de paiement'

class Rapport(StandardModel):
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='rapports'
    )
    type_document = models.CharField(
        max_length=20,
        choices=TypeDocument.choices
    )
    fichier = models.FileField(upload_to='rapports/', blank=True, null=True)
    date_generation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type_document} - {self.utilisateur}"