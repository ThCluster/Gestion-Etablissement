from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from backend.grades.models import Note
from backend.finance.models import Paiement
import datetime


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generer_bulletin(request, user_id):
    from rest_framework.response import Response
    from rest_framework import status
    from backend.comptes.models import Utilisateur
    from backend.comptes.scope import peut_consulter_donnees_eleve

    try:
        eleve = Utilisateur.objects.get(id=user_id)
    except Utilisateur.DoesNotExist:
        return Response({'error': 'Élève introuvable'}, status=status.HTTP_404_NOT_FOUND)

    if not peut_consulter_donnees_eleve(request.user, eleve):
        return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="bulletin_{eleve.username}.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    # En-tête
    p.setFont("Helvetica-Bold", 16)
    p.drawString(200, height - 50, "BULLETIN DE NOTES")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 100, f"Élève : {eleve.get_full_name()}")
    p.drawString(50, height - 120, f"Username : {eleve.username}")
    p.drawString(50, height - 140, f"Date : {datetime.date.today()}")

    # Notes
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, height - 180, "Notes :")
    p.setFont("Helvetica", 11)

    notes = Note.objects.filter(utilisateur=eleve)
    y = height - 210
    if notes.exists():
        somme_notes = 0
        nb_notes = 0
        for note in notes:
            p.drawString(70, y, f"{note.matiere.nom} : {note.note}/{note.note_max}")
            somme_notes += note.note
            nb_notes += 1
            y -= 25
        
        # Ligne de séparation
        p.line(50, y + 10, 200, y + 10)
        y -= 20
        
        # Affichage de la moyenne
        moyenne = round(somme_notes / nb_notes, 2)
        p.setFont("Helvetica-Bold", 12)
        p.drawString(70, y, f"MOYENNE GÉNÉRALE : {moyenne}/20")
    else:
        p.drawString(70, y, "Aucune note disponible")

    p.showPage()
    p.save()
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generer_certificat(request, user_id):
    from rest_framework.response import Response
    from rest_framework import status
    from backend.comptes.models import Utilisateur
    from backend.comptes.scope import peut_consulter_donnees_eleve

    try:
        eleve = Utilisateur.objects.get(id=user_id)
    except Utilisateur.DoesNotExist:
        return Response({'error': 'Élève introuvable'}, status=status.HTTP_404_NOT_FOUND)

    if not peut_consulter_donnees_eleve(request.user, eleve):
        return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="certificat_{eleve.username}.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 16)
    p.drawString(180, height - 50, "CERTIFICAT DE SCOLARITÉ")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 120, f"Je soussigné certifie que :")
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, height - 150, f"{eleve.get_full_name()}")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 180, f"est bien inscrit(e) dans notre établissement.")
    p.drawString(50, height - 210, f"Fait le : {datetime.date.today()}")

    p.showPage()
    p.save()
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generer_recu(request, paiement_id):
    from rest_framework.response import Response
    from rest_framework import status
    from backend.comptes.scope import peut_consulter_donnees_eleve

    try:
        paiement = Paiement.objects.get(id=paiement_id)
    except Paiement.DoesNotExist:
        return Response({'error': 'Paiement introuvable'}, status=status.HTTP_404_NOT_FOUND)

    if not peut_consulter_donnees_eleve(request.user, paiement.utilisateur):
        return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="recu_{paiement.reference}.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 16)
    p.drawString(220, height - 50, "REÇU DE PAIEMENT")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 100, f"Référence : {paiement.reference}")
    p.drawString(50, height - 120, f"Élève : {paiement.utilisateur.get_full_name()}")
    p.drawString(50, height - 140, f"Montant : {paiement.montant} FCFA")
    p.drawString(50, height - 160, f"Type : {paiement.get_type_paiement_display()}")
    p.drawString(50, height - 180, f"Statut : {paiement.get_statut_display()}")
    p.drawString(50, height - 200, f"Date : {datetime.date.today()}")

    p.showPage()
    p.save()
    return response