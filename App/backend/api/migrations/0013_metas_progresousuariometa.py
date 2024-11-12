# Generated by Django 5.1 on 2024-11-09 06:04

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_publicacion_estado'),
    ]

    operations = [
        migrations.CreateModel(
            name='Metas',
            fields=[
                ('idMeta', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=150)),
                ('desc', models.CharField(max_length=500)),
                ('finalMeta', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='ProgresoUsuarioMeta',
            fields=[
                ('idPUM', models.AutoField(primary_key=True, serialize=False)),
                ('progreso', models.IntegerField()),
                ('completado25', models.BooleanField(default=False)),
                ('completado50', models.BooleanField(default=False)),
                ('completado75', models.BooleanField(default=False)),
                ('completado100', models.BooleanField(default=False)),
                ('emailUser', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('idMeta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.metas')),
            ],
            options={
                'unique_together': {('emailUser', 'idMeta')},
            },
        ),
    ]
