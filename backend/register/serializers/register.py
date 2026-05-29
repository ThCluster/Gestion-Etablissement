from rest_framework import serializers
from backend.register.models import Inscription

class InscriptionSerializer(serializers.ModelSerializer):
    utilisateur_nom = serializers.CharField(source='utilisateur.get_full_name', read_only=True)
    classe_nom = serializers.CharField(source='classe.nom', read_only=True)

    class Meta:
        model = Inscription
        fields = ['id', 'utilisateur', 'utilisateur_nom', 'classe', 'classe_nom', 'annee_scolaire', 'date_inscription', 'active', 'created_at']
        read_only_fields = ['id', 'date_inscription']