# Generated by Django 5.1.4 on 2024-12-17 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Dynamics', '0007_message_message_type_message_request_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='acceptedrequest',
            name='accepted_by',
        ),
        migrations.AddField(
            model_name='acceptedrequest',
            name='status',
            field=models.CharField(default='en_proceso', max_length=20),
        ),
    ]
