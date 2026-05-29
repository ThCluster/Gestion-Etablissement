# comptes/serializers/comptes.py

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from backend.comptes.models import Utilisateur, Role


class InscriptionSerializer(serializers.ModelSerializer):
    """Pour créer un nouveau compte"""

    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Utilisateur
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'telephone',
            'password',
            'password2'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Les mots de passe ne correspondent pas."
            })

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')

        password = validated_data.pop('password')

        user = Utilisateur(**validated_data)

        # hash du mot de passe
        user.set_password(password)

        user.save()

        return user


class UtilisateurSerializer(serializers.ModelSerializer):
    """Pour lire/modifier un profil avec données scolaires"""
    parent_nom = serializers.ReadOnlyField(source='parent.get_full_name')
    moyenne = serializers.SerializerMethodField()
    absences_count = serializers.SerializerMethodField()
    statut_paiement = serializers.SerializerMethodField()
    classe_nom = serializers.SerializerMethodField()
    matieres_prof = serializers.SerializerMethodField()
    classes_prof = serializers.SerializerMethodField()
    enfants = serializers.SerializerMethodField()

    class Meta:
        model = Utilisateur
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'telephone', 'photo', 'parent', 'parent_nom',
            'matricule', 'moyenne', 'absences_count', 'statut_paiement',
            'classe_nom', 'matieres_prof', 'classes_prof', 'enfants'
        ]
        read_only_fields = ['id']

    def get_matieres_prof(self, obj):
        if obj.role != 'enseignant': return None
        return list(obj.matieres_enseignees.values_list('nom', flat=True))

    def get_classes_prof(self, obj):
        if obj.role != 'enseignant': return None
        return list(obj.classes_responsables.values_list('nom', flat=True))

    def get_moyenne(self, obj):
        if obj.role != 'eleve': return None
        notes = obj.notes.all()
        if not notes: return 0
        return round(sum(n.note for n in notes) / len(notes), 2)

    def get_absences_count(self, obj):
        if obj.role != 'eleve': return None
        return obj.absences.filter(statut='absent').count()

    def get_statut_paiement(self, obj):
        if obj.role != 'eleve': return None
        # On vérifie s'il y a des paiements en attente
        has_pending = obj.paiements.filter(statut='en_attente').exists()
        return 'retard' if has_pending else 'regle'

    def get_classe_nom(self, obj):
        # On cherche via l'inscription active
        inscription = obj.inscriptions.filter(active=True).first()
        return inscription.classe.nom if inscription else "Non inscrit"

    def get_enfants(self, obj):
        if obj.role != Role.PARENT:
            return None
        return [{"id": e.id, "first_name": e.first_name, "last_name": e.last_name, "email": e.email} for e in obj.enfants.all()]


class LoginSerializer(serializers.Serializer):
    """Pour le login"""

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)