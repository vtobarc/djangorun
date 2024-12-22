# forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.validators import RegexValidator
from .models import CustomUser, Solicitud
from django import forms
from django.contrib.auth.forms import UserChangeForm
from .models import CustomUser, Education, Experience, PaymentMethod



class CustomUserCreationForm(UserCreationForm):
    cedula = forms.CharField(
        max_length=20,
        validators=[RegexValidator(r'^\d+$', 'Enter a valid cedula number.')],
        required=True
    )
    first_name = forms.CharField(max_length=100)
    last_name = forms.CharField(max_length=100)
    email = forms.EmailField(required=True)
    telefono = forms.CharField(
        max_length=20,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')]
    )
    direccion = forms.CharField(max_length=255)
    ciudad = forms.CharField(max_length=100)
    provincia = forms.CharField(max_length=100)
    pais = forms.CharField(max_length=100)
    rol = forms.ChoiceField(choices=[('Usuario', 'Usuario'), ('Servidor', 'Servidor')])
    fecha_nacimiento = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    foto_perfil = forms.ImageField(required=False)
    genero = forms.ChoiceField(choices=[('Masculino', 'Masculino'), ('Femenino', 'Femenino'), ('Otro', 'Otro')], required=False)
    idioma_preferido = forms.ChoiceField(choices=[('es', 'Español'), ('en', 'Inglés')], required=False)
    cover_photo = forms.ImageField(required=False)  # Campo de imagen para la portada

    class Meta:
        model = CustomUser
        fields = (
        'cedula', 'first_name', 'last_name', 'email', 'telefono', 'direccion',
        'ciudad', 'provincia', 'pais', 'rol', 'username', 'password1', 'password2',
        'fecha_nacimiento', 'foto_perfil', 'genero', 'idioma_preferido',
        'titulo_profesional', 'biografia', 'linkedin_url', 'github_url',
        'portfolio_url', 'habilidades_tecnicas', 'habilidades_blandas', 'cover_photo'
    )
        
       
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError("Este correo electrónico ya está en uso.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.cedula = self.cleaned_data['cedula']
        user.telefono = self.cleaned_data['telefono']
        user.direccion = self.cleaned_data['direccion']
        user.fecha_nacimiento = self.cleaned_data.get('fecha_nacimiento', None)
        user.foto_perfil = self.cleaned_data.get('foto_perfil', None)
        user.genero = self.cleaned_data.get('genero', None)
        user.idioma_preferido = self.cleaned_data.get('idioma_preferido', None)
        user.cover_photo = self.cleaned_data.get('cover_photo', None)  # Guardar cover_photo

        if commit:
            user.save()
        return user


class CustomUserChangeForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = [
            'cedula', 'first_name', 'last_name', 'email', 'telefono', 'direccion', 
            'ciudad', 'provincia', 'pais', 'rol', 'fecha_nacimiento', 'genero', 
            'idioma_preferido', 'foto_perfil', 'titulo_profesional', 'biografia', 
            'linkedin_url', 'github_url', 'portfolio_url', 'habilidades_tecnicas', 
            'habilidades_blandas', 'cover_photo'
        ]
        widgets = {
            'fecha_nacimiento': forms.DateInput(attrs={'type': 'date'}),
            'biografia': forms.Textarea(attrs={'rows': 4}),
            'habilidades_tecnicas': forms.Textarea(attrs={'rows': 4}),
            'habilidades_blandas': forms.Textarea(attrs={'rows': 4}),
        }



class EducationForm(forms.ModelForm):
    class Meta:
        model = Education
        fields = ('institucion', 'titulo', 'fecha_inicio', 'fecha_fin')
        widgets = {
            'fecha_inicio': forms.DateInput(attrs={'type': 'date'}),
            'fecha_fin': forms.DateInput(attrs={'type': 'date'}),
        }

class ExperienceForm(forms.ModelForm):
    class Meta:
        model = Experience
        fields = ('empresa', 'cargo', 'fecha_inicio', 'fecha_fin', 'descripcion')
        widgets = {
            'fecha_inicio': forms.DateInput(attrs={'type': 'date'}),
            'fecha_fin': forms.DateInput(attrs={'type': 'date'}),
            'descripcion': forms.Textarea(attrs={'rows': 4}),
        }

class PaymentMethodForm(forms.ModelForm):
    class Meta:
        model = PaymentMethod
        fields = ('tipo_tarjeta', 'numero_tarjeta', 'fecha_expiracion', 'cvv')
        widgets = {
            'fecha_expiracion': forms.DateInput(attrs={'type': 'date'}),
            'numero_tarjeta': forms.TextInput(attrs={'maxlength': '16'}),
            'cvv': forms.TextInput(attrs={'maxlength': '4'}),
        }

class PasswordChangeForm(forms.Form):
    current_password = forms.CharField(widget=forms.PasswordInput)
    new_password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get("new_password")
        confirm_password = cleaned_data.get("confirm_password")
        if new_password and confirm_password and new_password != confirm_password:
            raise forms.ValidationError("Las nuevas contraseñas no coinciden.")
        return cleaned_data
class SolicitudServicioForm(forms.ModelForm):
    class Meta:
        model = Solicitud
        fields = ['titulo', 'descripcion', 'foto', 'precio_acordado', 'fecha_limite', 'progreso', 'motivo_rechazo', 'estado', 'valoraciones', 'prioridad', 'metodo_contacto', 'archivos_adjuntos', 'tiempo_estimado', 'comentarios']
        widgets = {
            'titulo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter the service title'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control'}),
            'foto': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
            'precio_acordado': forms.NumberInput(attrs={'class': 'form-control'}),
            'fecha_limite': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'progreso': forms.Select(attrs={'class': 'form-control'}),
            'motivo_rechazo': forms.Textarea(attrs={'class': 'form-control'}),
            'estado': forms.Select(attrs={'class': 'form-control'}),
            'valoraciones': forms.NumberInput(attrs={'class': 'form-control'}),
            'prioridad': forms.Select(attrs={'class': 'form-control'}),
            'metodo_contacto': forms.TextInput(attrs={'class': 'form-control'}),
            'archivos_adjuntos': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
            'tiempo_estimado': forms.TextInput(attrs={'class': 'form-control'}),
            'comentarios': forms.Textarea(attrs={'class': 'form-control'}),
        }