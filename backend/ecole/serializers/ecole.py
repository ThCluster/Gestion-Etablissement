from rest_framework import serializers
from backend.ecole.models import Filiere, Classe

class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = ['id', 'nom', 'description', 'active', 'created_at']

class ClasseSerializer(serializers.ModelSerializer):
    filiere_nom = serializers.CharField(source='filiere.nom', read_only=True)
    enseignant_responsable_nom = serializers.SerializerMethodField()

    def get_enseignant_responsable_nom(self, obj):
        u = getattr(obj, 'enseignant_responsable', None)
        if not u:
            return ''
        return u.get_full_name() or u.username

    class Meta:
        model = Classe
        fields = [
            'id',
            'nom',
            'niveau',
            'capacite',
            'filiere',
            'filiere_nom',
            'enseignant_responsable',
            'enseignant_responsable_nom',
            'active',
            'created_at',
        ]