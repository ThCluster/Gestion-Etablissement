# base/models.py
from django.db import models

class StandardModel(models.Model):
    
    class Meta:
        abstract = True  # ← pas de table créée en BDD

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)