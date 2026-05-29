"""Portée des données pour les enseignants (classes dont ils sont responsables)."""

from backend.comptes.models import Role


def classe_ids_pour_enseignant(user):
    """IDs des classes où `user` est enseignant responsable, ou None si ce n'est pas un enseignant."""
    if getattr(user, 'role', None) != Role.ENSEIGNANT:
        return None
    from backend.ecole.models import Classe

    return list(
        Classe.objects.filter(active=True, enseignant_responsable=user).values_list('id', flat=True)
    )


def eleve_ids_pour_enseignant(user):
    """IDs des élèves inscrits dans une classe dont l'enseignant est responsable."""
    if getattr(user, 'role', None) != Role.ENSEIGNANT:
        return None
    from backend.register.models import Inscription

    classe_ids = classe_ids_pour_enseignant(user)
    if not classe_ids:
        return []
    return list(
        Inscription.objects.filter(active=True, classe_id__in=classe_ids)
        .values_list('utilisateur_id', flat=True)
        .distinct()
    )


def filiere_ids_pour_enseignant(user):
    if getattr(user, 'role', None) != Role.ENSEIGNANT:
        return None
    from backend.ecole.models import Classe

    classe_ids = classe_ids_pour_enseignant(user)
    if not classe_ids:
        return []
    return list(
        Classe.objects.filter(id__in=classe_ids).values_list('filiere_id', flat=True).distinct()
    )


def peut_consulter_donnees_eleve(viewer, eleve) -> bool:
    """Admin, superuser, l'élève lui-même, ou enseignant responsable d'une classe de l'élève."""
    if not viewer.is_authenticated:
        return False
    if viewer.is_superuser or getattr(viewer, 'role', None) == Role.ADMIN:
        return True
    if eleve.pk == viewer.pk:
        return True
    if getattr(viewer, 'role', None) != Role.ENSEIGNANT:
        return False
    ids = eleve_ids_pour_enseignant(viewer)
    return bool(ids) and eleve.pk in ids
