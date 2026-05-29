from django.urls import path
from backend.rapport.views import generer_bulletin, generer_certificat, generer_recu

urlpatterns = [
    path('bulletin/<int:user_id>/', generer_bulletin, name='bulletin'),
    path('certificat/<int:user_id>/', generer_certificat, name='certificat'),
    path('recu/<int:paiement_id>/', generer_recu, name='recu'),
]