from django.contrib import admin

# Register your models here.
from django.contrib import admin
from backend.grades.models import Matiere, Note

admin.site.register(Matiere)
admin.site.register(Note)