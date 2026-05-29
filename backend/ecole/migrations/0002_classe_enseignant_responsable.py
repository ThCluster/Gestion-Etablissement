import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ecole', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='classe',
            name='enseignant_responsable',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='classes_responsables',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
