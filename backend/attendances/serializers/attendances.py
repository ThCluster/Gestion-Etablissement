from rest_framework import serializers
from backend.attendances.models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    utilisateur_nom = serializers.CharField(source='utilisateur.get_full_name', read_only=True)
    classe_nom = serializers.CharField(source='classe.nom', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'utilisateur', 'utilisateur_nom', 'classe', 'classe_nom',
                  'date', 'statut', 'statut_display', 'motif', 'justifie',
                  'active', 'created_at']
        read_only_fields = ['id', 'created_at']