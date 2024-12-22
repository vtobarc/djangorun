# Generated by Django 5.1.4 on 2024-12-18 03:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Dynamics', '0010_rename_content_notification_message_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Mensaje',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contenido', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('leido', models.BooleanField(default=False)),
                ('usuario_destino', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mensajes_recibidos', to=settings.AUTH_USER_MODEL)),
                ('usuario_origen', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mensajes_enviados', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]