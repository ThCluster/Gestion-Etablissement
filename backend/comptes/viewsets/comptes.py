from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate

from backend.comptes.models import Utilisateur, Role
from backend.comptes.serializers.comptes import (
    InscriptionSerializer,
    UtilisateurSerializer,
    LoginSerializer,
)


class InscriptionViewSet(viewsets.ViewSet):
    """POST /api/inscriptions/ — créer un nouveau compte."""

    permission_classes = [AllowAny]

    def create(self, request):
        serializer = InscriptionSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "Compte créé avec succès",
                    "user": UtilisateurSerializer(user).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UtilisateurViewSet(viewsets.ViewSet):
    """
    GET /api/utilisateurs/              → profil de l'utilisateur connecté
    GET /api/utilisateurs/?role=eleve   → liste filtrée (admin/enseignant seulement)
    """

    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        role_filter = request.query_params.get("role", None)
        parent_filter = request.query_params.get("parent", None)

        # Filtre pour les parents : voir leurs enfants
        if parent_filter == "me":
            qs = Utilisateur.objects.filter(parent=user, is_active=True)
            serializer = UtilisateurSerializer(qs, many=True)
            return Response({
                "count": qs.count(),
                "results": serializer.data
            })

        if role_filter:
            # Seuls admin et superuser peuvent lister tous les rôles
            if user.is_superuser or getattr(user, "role", None) == Role.ADMIN:
                qs = Utilisateur.objects.filter(role=role_filter, is_active=True)
            elif getattr(user, "role", None) == Role.ENSEIGNANT:
                # Un enseignant peut voir la liste de ses élèves uniquement
                if role_filter == Role.ELEVE:
                    from backend.comptes.scope import eleve_ids_pour_enseignant
                    eids = eleve_ids_pour_enseignant(user)
                    qs = Utilisateur.objects.filter(id__in=eids, is_active=True)
                else:
                    qs = Utilisateur.objects.none()
            else:
                qs = Utilisateur.objects.none()

            serializer = UtilisateurSerializer(qs, many=True)
            return Response(
                {
                    "count": qs.count(),
                    "next": None,
                    "previous": None,
                    "results": serializer.data,
                }
            )

        # Sans filtre → profil de l'utilisateur connecté
        return Response(UtilisateurSerializer(user).data)

    def retrieve(self, request, pk=None):
        try:
            utilisateur = Utilisateur.objects.get(pk=pk, is_active=True)
        except Utilisateur.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user.is_superuser or getattr(user, 'role', None) == Role.ADMIN:
            pass
        elif user == utilisateur:
            pass
        elif getattr(user, 'role', None) == Role.ENSEIGNANT:
            from backend.comptes.scope import eleve_ids_pour_enseignant
            eids = eleve_ids_pour_enseignant(user)
            if not eids or utilisateur.id not in eids:
                return Response({"detail": "Non autorisé."}, status=status.HTTP_403_FORBIDDEN)
        elif getattr(user, 'role', None) == Role.PARENT:
            if utilisateur.parent != user:
                return Response({"detail": "Non autorisé."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"detail": "Non autorisé."}, status=status.HTTP_403_FORBIDDEN)

        serializer = UtilisateurSerializer(utilisateur)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        try:
            utilisateur = Utilisateur.objects.get(pk=pk, is_active=True)
        except Utilisateur.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        is_admin = user.is_superuser or getattr(user, 'role', None) == Role.ADMIN

        if not is_admin and user != utilisateur:
            return Response({"detail": "Non autorisé."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        if not is_admin:
            data.pop('role', None)
            data.pop('parent', None)
            data.pop('matricule', None)
            data.pop('is_staff', None)
            data.pop('is_superuser', None)

        serializer = UtilisateurSerializer(utilisateur, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        return self.partial_update(request, pk)


class LoginViewSet(viewsets.ViewSet):
    """POST /api/login/ — authentifier et retourner les tokens JWT."""

    permission_classes = [AllowAny]

    def create(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]

            print(f"--- Tentative de connexion ---")
            print(f"Username reçu: {username}")
            
            # On passe l'objet request à authenticate pour plus de robustesse
            user = authenticate(request=request, username=username, password=password)

            if user:
                print(f"Succès: Utilisateur {username} authentifié.")
                if not user.is_active:
                    print(f"Échec: Compte {username} désactivé.")
                    return Response(
                        {"error": "Ce compte est désactivé."},
                        status=status.HTTP_403_FORBIDDEN,
                    )

                refresh = RefreshToken.for_user(user)

                return Response(
                    {
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                        "user": UtilisateurSerializer(user).data,
                    },
                    status=status.HTTP_200_OK,
                )

            print(f"Échec: authenticate() a retourné None pour {username}")
            return Response(
                {"error": "Identifiants invalides (DEBUG)"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)