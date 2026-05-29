from rest_framework import serializers
from backend.grades.models import Matiere, Note

class MatiereSerializer(serializers.ModelSerializer):
    classe_nom = serializers.CharField(source='classe.nom', read_only=True)

    class Meta:
        model = Matiere
        fields = ['id', 'nom', 'code', 'coefficient', 'classe', 'classe_nom', 'active', 'created_at']
        read_only_fields = ['id', 'created_at']

class NoteSerializer(serializers.ModelSerializer):
    utilisateur_nom = serializers.CharField(source='utilisateur.get_full_name', read_only=True)
    matiere_nom = serializers.CharField(source='matiere.nom', read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'utilisateur', 'utilisateur_nom', 'matiere', 'matiere_nom',
                  'note', 'note_max', 'commentaire', 'date_evaluation', 'active', 'created_at']
        read_only_fields = ['id', 'created_at']