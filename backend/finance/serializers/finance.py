from rest_framework import serializers
from backend.finance.models import Paiement, Recu

class PaiementSerializer(serializers.ModelSerializer):
    utilisateur_nom = serializers.CharField(source='utilisateur.get_full_name', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    type_display = serializers.CharField(source='get_type_paiement_display', read_only=True)

    class Meta:
        model = Paiement
        fields = ['id', 'utilisateur', 'utilisateur_nom', 'type_paiement', 'type_display',
                  'montant', 'statut', 'statut_display', 'date_paiement', 'reference',
                  'description', 'active', 'created_at']
        read_only_fields = ['id', 'created_at']

class RecuSerializer(serializers.ModelSerializer):
    paiement_reference = serializers.CharField(source='paiement.reference', read_only=True)

    class Meta:
        model = Recu
        fields = ['id', 'paiement', 'paiement_reference', 'numero_recu', 'date_emission', 'active', 'created_at']
        read_only_fields = ['id', 'date_emission', 'created_at']