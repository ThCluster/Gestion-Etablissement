# comptes/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from backend.base.models import StandardModel

class Role(models.TextChoices):
    ADMIN = 'admin', 'Administrateur'
    ENSEIGNANT = 'enseignant', 'Enseignant'
    ELEVE = 'eleve', 'Élève'
    PARENT = 'parent', 'Parent'

class Utilisateur(AbstractUser, StandardModel):
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.ELEVE
    )
    matricule = models.CharField(max_length=50, unique=True, blank=True, null=True)
    telephone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='enfants',
        verbose_name="Parent / Responsable",
        limit_choices_to={'role': Role.PARENT}
    )

    # Ces deux lignes règlent le conflit ↓
    groups = models.ManyToManyField(
        'auth.Group',
        blank=True,
        related_name='utilisateur_set'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        blank=True, 
        related_name='utilisateur_set'
    )

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"