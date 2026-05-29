from django.contrib import admin
from backend.finance.models import Paiement, Recu

admin.site.register(Paiement)
admin.site.register(Recu)