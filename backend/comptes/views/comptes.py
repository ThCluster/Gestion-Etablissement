# comptes/views/comptes.py
# Re-export des viewsets pour compatibilité avec les imports existants.
from backend.comptes.viewsets.comptes import (
    InscriptionViewSet,
    UtilisateurViewSet,
    LoginViewSet,
)

__all__ = ["InscriptionViewSet", "UtilisateurViewSet", "LoginViewSet"]
