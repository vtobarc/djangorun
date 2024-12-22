from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import RegexValidator
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _


User = settings.AUTH_USER_MODEL

class CustomUser(AbstractUser):
    cedula = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(r'^\d+$', 'Enter a valid cedula number.')],
        default='0000000000'
    )
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')]
    )
    ciudad = models.CharField(max_length=100)
    provincia = models.CharField(max_length=100)
    pais = models.CharField(max_length=100)
    rol = models.CharField(max_length=50, choices=[('Usuario', 'Usuario'), ('Servidor', 'Servidor')])
    historial_tareas = models.TextField(blank=True, null=True)
    preferencias = models.JSONField(default=dict, blank=True)
    calificaciones = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    foto_perfil = models.ImageField(upload_to='perfil/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover_photos/', blank=True, null=True)  # NUEVO CAMPO
    genero = models.CharField(max_length=10, choices=[('Masculino', 'Masculino'), ('Femenino', 'Femenino'), ('Otro', 'Otro')], blank=True, null=True)
    ultimo_acceso = models.DateTimeField(auto_now=True)
    ip_registro = models.GenericIPAddressField(blank=True, null=True)
    idioma_preferido = models.CharField(max_length=10, choices=[('es', 'Español'), ('en', 'Inglés')], blank=True, null=True)
    titulo_profesional = models.CharField(max_length=100, blank=True, null=True)
    biografia = models.TextField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    habilidades_tecnicas = models.TextField(blank=True, null=True)
    habilidades_blandas = models.TextField(blank=True, null=True)

    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        related_name='customuser_groups',
        related_query_name='user',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        related_name='customuser_permissions',
        related_query_name='user',
    )

    def __str__(self):
        return f"{self.username} - {self.cedula}"

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

class Education(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='education')
    institucion = models.CharField(max_length=100)
    titulo = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(blank=True, null=True)

class Experience(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='experience')
    empresa = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(blank=True, null=True)
    descripcion = models.TextField()

class PaymentMethod(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payment_methods')
    tipo_tarjeta = models.CharField(max_length=50)
    numero_tarjeta = models.CharField(max_length=16)
    fecha_expiracion = models.DateField()
    cvv = models.CharField(max_length=4)



class Solicitud(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En proceso'),
        ('finalizado', 'Finalizado'),
        ('rechazado', 'Rechazado'),
    ]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    foto = models.ImageField(upload_to='servicios/')
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    precio_acordado = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fecha_limite = models.DateTimeField(null=True, blank=True)
    progreso = models.CharField(max_length=50, choices=[('pendiente', 'Pendiente'), ('en_proceso', 'En Proceso'), ('completado', 'Completado')], default='pendiente')
    estado = models.CharField(max_length=50, choices=[('pendiente', 'Pendiente'), ('en_proceso', 'En Proceso'), ('finalizado', 'Finalizado')], default='pendiente')
    valoraciones = models.IntegerField(null=True, blank=True)
    metodo_contacto = models.CharField(max_length=100, null=True, blank=True)
    archivos_adjuntos = models.FileField(upload_to='archivos_adjuntos/', null=True, blank=True)
    tiempo_estimado = models.DurationField(null=True, blank=True)
    comentarios = models.TextField(null=True, blank=True)
    prioridad = models.CharField(max_length=100)
    motivo_rechazo = models.TextField(null=True, blank=True)

      # Nuevo campo para almacenar quién aceptó la solicitud
    aceptado_por = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='solicitudes_aceptadas')

    def __str__(self):
        return self.titulo


class Progreso(models.TextChoices):
    PENDIENTE = 'pendiente', 'Pendiente'
    EN_PROCESO = 'en_proceso', 'En Proceso'
    COMPLETADO = 'completado', 'Completado'


class Servicio(models.Model):
    CATEGORIA_CHOICES = [
        ('tecnologia', 'Tecnología'),
        ('diseno', 'Diseño'),
        ('marketing', 'Marketing'),
        ('escritura', 'Escritura y Traducción'),
        ('programacion', 'Programación y Desarrollo'),
        ('negocios', 'Negocios'),
        ('otros', 'Otros'),
    ]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    categoria = models.CharField(max_length=50, choices=CATEGORIA_CHOICES)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    tiempo_estimado = models.DurationField(help_text="Tiempo estimado para completar el servicio")
    proveedor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='servicios_ofrecidos')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)
    imagen = models.ImageField(upload_to='servicios/', blank=True, null=True)
    requisitos = models.TextField(blank=True, help_text="Requisitos para solicitar este servicio")
    tags = models.CharField(max_length=255, blank=True, help_text="Tags separados por comas")

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'
        ordering = ['-fecha_creacion']
        

