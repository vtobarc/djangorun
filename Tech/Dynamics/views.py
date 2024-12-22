from venv import logger
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.views.decorators.http import require_GET
from .forms import CustomUserCreationForm
from django.contrib.auth.models import User
from .models import CustomUser, Solicitud  # Importar el modelo CustomUser
from .forms import SolicitudServicioForm
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
from .forms import CustomUserCreationForm, SolicitudServicioForm
from .models import CustomUser, Solicitud
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import F
from .models import Solicitud
from .models import CustomUser
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.utils.timezone import now
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
from .models import Solicitud
from .forms import SolicitudServicioForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.shortcuts import render, redirect
from .models import CustomUser  # Asegúrate de importar tu modelo CustomUser
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.shortcuts import render, redirect
from .models import CustomUser  # Asegúrate de importar tu modelo CustomUser
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import CustomUserChangeForm, EducationForm, ExperienceForm, PaymentMethodForm, PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.views.decorators.http import require_http_methods
from .models import Education, Experience, PaymentMethod
from django.contrib.auth.decorators import user_passes_test
from .models import Solicitud, Servicio
from django.core.exceptions import PermissionDenied
from .forms import EducationForm, ExperienceForm, PaymentMethodForm
from django.views.decorators.http import require_POST
from Dynamics.models import CustomUser  # Ajusta el nombre según tu proyecto
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

# Create your views here.


def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            next_page = request.GET.get('next', 'home')
            return redirect(next_page)
        else:
            messages.error(request, 'Invalid username or password')
    return render(request, 'dashboard/login.html')

def signup_view(request):
    if request.method == 'POST':
        # Obtén los datos del formulario
        cedula = request.POST['cedula']
        nombre = request.POST['nombre']
        apellido = request.POST['apellido']
        email = request.POST['email']
        telefono = request.POST['telefono']
        direccion = request.POST['direccion']
        ciudad = request.POST['ciudad']
        provincia = request.POST['provincia']
        pais = request.POST['pais']
        rol = request.POST['rol']
        username = request.POST['username']
        password1 = request.POST['password1']
        password2 = request.POST['password2']

        # Validar que la cédula no esté vacía
        if not cedula:
            messages.error(request, 'El campo Cédula es obligatorio')
            return redirect('signup')

        # Validar contraseñas
        if password1 != password2:
            messages.error(request, 'Las contraseñas no coinciden')
            return redirect('signup')

        try:
            # Crea el usuario si todo es correcto usando CustomUser
            user = CustomUser.objects.create_user(username=username, email=email, password=password1)
            user.first_name = nombre
            user.last_name = apellido
            user.cedula = cedula
            user.direccion = direccion
            user.telefono = telefono
            user.ciudad = ciudad
            user.provincia = provincia
            user.pais = pais
            user.rol = rol
            user.save()
            
            
            messages.success(request, 'Cuenta creada exitosamente!')
           
            return redirect('login')
        
        except Exception as e:
            messages.error(request, f'Ocurrió un error: {e}')
            return redirect('signup')
        
    return render(request, 'dashboard/signup.html')

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # Redirigir al login después del registro exitoso
    else:
        form = CustomUserCreationForm()
    return render(request, 'dashboard/signup.html', {'form': form})

def home(request):
    return render(request, 'dashboard/home.html')

@require_GET
def logout_view(request):
    logout(request)
    return redirect('login')



# Vista para la página del cliente
@login_required
def pagina_cliente(request):
    if request.method == 'POST':
        form = SolicitudServicioForm(request.POST, request.FILES)
        if form.is_valid():
            solicitud = form.save(commit=False)
            solicitud.usuario = request.user
            # Asignar valores predeterminados para progreso y estado
            if not solicitud.progreso:
                solicitud.progreso = 'pendiente'
            if not solicitud.estado:
                solicitud.estado = 'pendiente'
            solicitud.save()
            messages.success(request, 'Solicitud creada exitosamente.')
            return redirect('dashboard/pagina_cliente')  # Redirige a la misma página o donde desees
    else:
        form = SolicitudServicioForm()

    solicitudes = Solicitud.objects.filter(usuario=request.user).order_by('-fecha_solicitud')
    solicitudes_list = Solicitud.objects.filter(usuario=request.user).order_by('-fecha_solicitud')

# Paginación: Dividir las solicitudes en páginas
    paginator = Paginator(solicitudes_list, 6)  # Mostrar 6 solicitudes por página
    page = request.GET.get('page')  # Obtener el número de página de la URL
    try:
        solicitudes = paginator.page(page)
    except PageNotAnInteger:
        solicitudes = paginator.page(1)
    except EmptyPage:
        solicitudes = paginator.page(paginator.num_pages)
    
    
    return render(request, 'dashboard/pagina_cliente.html', {'form': form, 'solicitudes': solicitudes})

# Función para editar solicitud
@require_POST
def editar_solicitud(request, id):
    solicitud = get_object_or_404(Solicitud, id=id)
    data = json.loads(request.body)
    solicitud.titulo = data['titulo']
    solicitud.descripcion = data['descripcion']
    solicitud.save()
    return JsonResponse({'success': True})

# Función para eliminar solicitud
@require_POST
def eliminar_solicitud(request, id):
    solicitud = get_object_or_404(Solicitud, id=id)
    solicitud.delete()
    return JsonResponse({'success': True})

# Función unificada para crear solicitud con verificación de solicitudes recientes
@login_required
@csrf_exempt
def crear_solicitud(request):
    if request.method == 'POST' and request.FILES:
        titulo = request.POST.get('titulo')
        descripcion = request.POST.get('descripcion')
        foto = request.FILES.get('foto')  # Captura la imagen subida
        metodo_contacto = request.POST['metodo_contacto']  # Método de contacto
        fecha_limite = request.POST['fecha_limite']
        # Crear la nueva solicitud y asociarla al usuario autenticado
        nueva_solicitud = Solicitud.objects.create(
            titulo=titulo,
            descripcion=descripcion,
            foto=foto,  # Asignar la foto cargada
            metodo_contacto=metodo_contacto,  # Guardar el método de contacto
            fecha_limite=fecha_limite,
            usuario=request.user  # Asociar al usuario autenticado
        )

        return JsonResponse({
            'success': True,
            'id': nueva_solicitud.id,
            'titulo': nueva_solicitud.titulo,
            'descripcion': nueva_solicitud.descripcion,
            'foto_url': nueva_solicitud.foto.url  # Enviar la URL de la foto en la respuesta
        })
    return JsonResponse({'success': False, 'error': 'Método no permitido'})


# Función para crear una nueva solicitud (para manejar peticiones no POST)
def nueva_solicitud(request):
    if request.method == 'POST':
        form = SolicitudServicioForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Formulario no válido'})
    return JsonResponse({'success': False, 'error': 'Método no permitido'})



@login_required
def profile_config(request):
    if request.method == 'POST':
        # Obtener los datos del formulario
        nombre = request.POST.get('nombre')
        apellido = request.POST.get('apellido')
        email = request.POST.get('email')
        telefono = request.POST.get('telefono')
        direccion = request.POST.get('direccion')
        ciudad = request.POST.get('ciudad')
        provincia = request.POST.get('provincia')
        pais = request.POST.get('pais')
        rol = request.POST.get('rol')
        genero = request.POST.get('genero')
        fecha_nacimiento = request.POST.get('fecha_nacimiento')
        idioma_preferido = request.POST.get('idioma_preferido')
        foto_perfil = request.FILES.get('foto_perfil')  # Foto de perfil (subida)
        preferencias = request.POST.get('preferencias')  # Puede ser un JSON, o solo un campo de texto
        password_actual = request.POST.get('password_actual')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        cover_photo = request.FILES.get('cover_photo')

        # Obtén el usuario actual
        user = request.user

        # Validación de datos obligatorios (nombre y apellido)
        if not nombre or not apellido:
            messages.error(request, 'El nombre y apellido son obligatorios.')
            return redirect('profile_config')

        # Validación del email (si se cambia)
        if email and email != user.email:
            user.email = email
            user.save()

        # Actualizar los campos básicos del perfil
        if nombre:
            user.first_name = nombre
            user.save()
        if apellido:
            user.last_name = apellido
            user.save()
        if telefono:
            user.telefono = telefono
            user.save()
        if direccion:
            user.direccion = direccion
        if ciudad:
            user.ciudad = ciudad
            user.save()
        if provincia:
            user.provincia = provincia
            user.save()
        if pais:
            user.pais = pais
            user.save()
        if rol:
            user.rol = rol
            user.save()
        if genero:
            user.genero = genero
            user.save()
        if fecha_nacimiento:
            user.fecha_nacimiento = fecha_nacimiento  # Asegúrate de que el formato de fecha sea correcto
            user.save()
           
        if idioma_preferido:
            user.idioma_preferido = idioma_preferido
        if preferencias:
            try:
                user.preferencias = preferencias  # Puedes convertir a un formato JSON si es necesario
            except ValueError:
                messages.error(request, 'Preferencias inválidas.')
                return redirect('profile_config')
        # Actualización de la foto de portada (si se proporciona)
        if cover_photo:
          try:
           user.cover_photo = cover_photo
           user.save()
           messages.success(request, 'Portada actualizada correctamente.')
          except Exception as e:
           messages.error(request, f'Error al guardar la foto de portada: {str(e)}')
            
        if foto_perfil:
            try:
                user.foto_perfil = foto_perfil
                user.save()
                messages.success(request, 'Foto de perfil actualizada correctamente.')
            except Exception as e:
                 messages.error(request, f'Error al guardar la foto de perfil: {str(e)}')
                 return redirect('profile_config')

        # Validación y cambio de contraseña
        if password_actual or password1 or password2:
            # Verifica si la contraseña actual fue proporcionada
            if not password_actual:
                messages.error(request, 'Debes ingresar tu contraseña actual para cambiarla.')
                return redirect('profile_config')
            
            if not user.check_password(password_actual):
                messages.error(request, 'La contraseña actual es incorrecta.')
                return redirect('profile_config')

            # Verificar que las nuevas contraseñas coinciden
            if password1 != password2:
                messages.error(request, 'Las nuevas contraseñas no coinciden.')
                return redirect('profile_config')

            # Establecer y guardar la nueva contraseña
            user.set_password(password1)
            user.save()

            # Actualizar la sesión para que el usuario no tenga que volver a iniciar sesión
            update_session_auth_hash(request, user)

            messages.success(request, 'Contraseña cambiada correctamente.')
            return redirect('profile_config')

        # Guardar los cambios del perfil
        user.save()
        messages.success(request, 'Datos de perfil actualizados correctamente.')
        return redirect('profile_config')
    
    # Si la solicitud es GET, cargamos los datos actuales del usuario
    user = request.user
    context = {
        'nombre': user.first_name,
        'apellido': user.last_name,
        'email': user.email,
        'telefono': user.telefono,
        'direccion': user.direccion,
        'ciudad': user.ciudad,
        'provincia': user.provincia,
        'pais': user.pais,
        'rol': user.rol,
        'genero': user.genero,
        'fecha_nacimiento': user.fecha_nacimiento,
        'idioma_preferido': user.idioma_preferido,
        'preferencias': user.preferencias,
        'foto_perfil': user.foto_perfil,
        'cover_photo': user.cover_photo,

    }
    return render(request, 'profile/profile_config.html', context)


@login_required
def profile(request):
    user = request.user
    # Acceder a los campos `ultimo_acceso` e `ip_registro`
    ultimo_acceso = user.ultimo_acceso
    ip_registro = user.ip_registro
    
    if request.method == 'POST':
          
        form = CustomUserChangeForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Tu perfil ha sido actualizado exitosamente.')
            return JsonResponse({'status': 'success', 'message': 'Perfil actualizado exitosamente'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    else:
        form = CustomUserChangeForm(instance=user)



    education = Education.objects.filter(user=user)
    experience = Experience.objects.filter(user=user)
    payment_methods = PaymentMethod.objects.filter(user=user)

    context = {
        'form': form,
        'education': education,
        'experience': experience,
        'payment_methods': payment_methods,
        'ultimo_acceso': ultimo_acceso,
        'ip_registro': ip_registro,
    }
    return render(request, 'profile/profile.html', context)

@login_required
def profile_view(request):
    user = request.user  # El usuario actualmente autenticado
    return render(request, 'profile/profile.html', {'user': user})

@require_http_methods(["POST"])
def update_profile(request):
    user = request.user
    form = CustomUserChangeForm(request.POST, request.FILES, instance=user)
    if form.is_valid():
        form.save()
        return JsonResponse({'status': 'success', 'message': 'Perfil actualizado exitosamente'})
    else:
        return JsonResponse({'status': 'error', 'errors': form.errors})

@login_required
def add_education(request):
    if request.method == 'POST':
        form = EducationForm(request.POST)
        if form.is_valid():
            education = form.save(commit=False)
            education.user = request.user  # Asociamos la educación al usuario logueado
            education.save()
            messages.success(request, 'Educación agregada exitosamente.')
            return redirect('profile')  # Redirige al perfil después de guardar
    else:
        form = EducationForm()  # Formulario vacío cuando se carga la página por primera vez

    return render(request, 'add/add_education.html', {'form': form})

@login_required
def edit_education(request, id):
    education = get_object_or_404(Education, id=id, user=request.user)
    
    if request.method == 'POST':
        form = EducationForm(request.POST, instance=education)  # Inicializa el formulario con los datos actuales
        if form.is_valid():
            form.save()  # Guarda los cambios
            messages.success(request, 'Educación actualizada exitosamente.')
            return redirect('profile')
    else:
        form = EducationForm(instance=education)  # Muestra el formulario con los datos existentes
        
    return render(request, 'edit/edit_education.html', {'form': form})

@login_required
def delete_education(request, id):
    education = get_object_or_404(Education, id=id, user=request.user)
    
    if request.method == 'POST':
        education.delete()
        messages.success(request, 'Educación eliminada exitosamente.')
        return redirect('profile')
    
    return render(request, 'delete/delete_education.html', {'education': education})





@login_required
def add_experience(request):
    if request.method == 'POST':
        form = ExperienceForm(request.POST)
        if form.is_valid():
            experience = form.save(commit=False)
            experience.user = request.user
            experience.save()
            messages.success(request, 'Experiencia agregada exitosamente.')
            return redirect('profile')
    else:
        form = ExperienceForm()
    return render(request, 'add/add_experience.html', {'form': form})
@login_required
def edit_experience(request, id):
    experience = get_object_or_404(Experience, id=id, user=request.user)
    
    if request.method == 'POST':
        form = ExperienceForm(request.POST, instance=experience)
        if form.is_valid():
            form.save()
            messages.success(request, 'Experiencia actualizada exitosamente.')
            return redirect('profile')
    else:
        form = ExperienceForm(instance=experience)
        
    return render(request, 'edit/edit_experience.html', {'form': form})
@login_required
def delete_experience(request, id):
    experience = get_object_or_404(Experience, id=id, user=request.user)
    
    if request.method == 'POST':
        experience.delete()
        messages.success(request, 'Experiencia eliminada exitosamente.')
        return redirect('profile')
    
    return render(request, 'delete/delete_experience.html', {'experience': experience})



from django.shortcuts import render
from .models import Solicitud

def listar_solicitudes(request):
    solicitudes = Solicitud.objects.all()
    context = {'solicitudes': solicitudes}
    return render(request, 'dashboard/historial.html', context)






@login_required
def add_payment_method(request):
    if request.method == 'POST':
        form = PaymentMethodForm(request.POST)
        if form.is_valid():
            payment_method = form.save(commit=False)
            payment_method.user = request.user
            payment_method.save()
            messages.success(request, 'Método de pago agregado exitosamente.')
            return redirect('profile')
    else:
        form = PaymentMethodForm()
    return render(request, 'add/add_payment_method.html', {'form': form})

@login_required
def delete_payment_method(request, id):
    # Obtener el método de pago usando el id proporcionado
    payment_method = get_object_or_404(PaymentMethod, id=id, user=request.user)

    if request.method == 'POST':  # Si es un POST, eliminamos el método de pago
        payment_method.delete()
        messages.success(request, 'Método de pago eliminado correctamente.')
        return redirect('profile')

    # Si no es un POST, mostramos la página de confirmación
    return render(request, 'delete/delete_payment_method.html', {'payment_method': payment_method})

@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.POST)
        if form.is_valid():
            user = request.user
            if user.check_password(form.cleaned_data['current_password']):
                user.set_password(form.cleaned_data['new_password'])
                user.save()
                update_session_auth_hash(request, user)
                messages.success(request, '¡Tu contraseña ha sido actualizada exitosamente!')
                return redirect('profile')
            else:
                messages.error(request, 'La contraseña actual es incorrecta.')
        else:
            messages.error(request, 'Por favor, corrige los errores abajo.')
    else:
        form = PasswordChangeForm()
    return render(request, 'add/change_password.html', {'form': form})













from django.http import JsonResponse


def is_servidor(user):
    return user.rol == 'Servidor'

@user_passes_test(is_servidor)
def prestadores_dashboard(request):
    solicitudes_list = Solicitud.objects.all().order_by('-fecha_solicitud')
    
    # Filtrado por estado
    estado = request.GET.get('estado')
    if estado:
        solicitudes_list = solicitudes_list.filter(estado=estado)
    
    # Solo mostrar solicitudes que no estén en estado finalizado/terminado o que pertenezcan al usuario actual.
    solicitudes_list = solicitudes_list.exclude(estado__in=['finalizado', 'terminado']) | \
                        solicitudes_list.filter(usuario=request.user)
    
    # Filtrado adicional por estado si se pasa como parámetro en la URL
    estado = request.GET.get('estado')
    if estado:
        solicitudes_list = solicitudes_list.filter(estado=estado)
    
    # Paginación
    page = request.GET.get('page', 1)
    paginator = Paginator(solicitudes_list, 10)  # 10 items por página
    try:
        solicitudes = paginator.page(page)
    except PageNotAnInteger:
        solicitudes = paginator.page(1)
    except EmptyPage:
        solicitudes = paginator.page(paginator.num_pages)
    
    context = {
        'solicitudes': solicitudes,
        'estados': dict(Solicitud.ESTADOS).items(),
    }
    return render(request, 'dashboard/prestadores_dashboard.html', context)
@user_passes_test(is_servidor)


@user_passes_test(is_servidor)
def solicitud_detalle(request, solicitud_id):
    solicitud = get_object_or_404(Solicitud, id=solicitud_id)
    usuario = solicitud.usuario  # Acceso al usuario relacionado con la solicitud
    return render(request, 'dashboard/solicitud_detalle.html', {
         'solicitud': solicitud,
        'usuario': usuario,
    })

@require_POST
@user_passes_test(is_servidor)
def cambiar_estado_solicitud(request, solicitud_id):
    solicitud = get_object_or_404(Solicitud, id=solicitud_id)
    data = json.loads(request.body)

    nuevo_estado = data.get('estado')
    nuevo_progreso = data.get('progreso')

    if nuevo_estado:
        solicitud.estado = nuevo_estado
        if nuevo_estado in ['finalizado', 'terminado']:
            solicitud.progreso = 'completado'
        if nuevo_estado == 'en_proceso' and not solicitud.aceptado_por:
            solicitud.aceptado_por = request.user
        solicitud.save()

    if nuevo_progreso:
        solicitud.progreso = nuevo_progreso
        solicitud.save()

    return JsonResponse({
        'message': 'Estado actualizado correctamente',
        'estado': solicitud.estado,
        'solicitud_id': solicitud.id
    })

def user_can_view_solicitud(view_func):
    def wrapper(request, solicitud_id, *args, **kwargs):
        solicitud = get_object_or_404(Solicitud, id=solicitud_id)
        if request.user.rol == 'Servidor' or solicitud.usuario == request.user:
            return view_func(request, solicitud_id, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper


@require_http_methods(["POST"])
@login_required
def actualizar_estado(request, solicitud_id):
    solicitud = get_object_or_404(Solicitud, id=solicitud_id)
    data = json.loads(request.body)
    nuevo_estado = data.get('estado')
    
    if nuevo_estado in dict(Solicitud.ESTADOS).keys():
        solicitud.estado = nuevo_estado
        if nuevo_estado == 'en_proceso':
            solicitud.progreso = 'en_proceso'
        elif nuevo_estado == 'finalizado':
            solicitud.progreso = 'completado'
        solicitud.save()
        return JsonResponse({
            'success': True,
            'estado': solicitud.get_estado_display(),
            'progreso': solicitud.get_progreso_display()
        })
    else:
        return JsonResponse({'success': False, 'error': 'Estado no válido'})

@require_http_methods(["POST"])
@login_required
def rechazar_solicitud(request, solicitud_id):
    solicitud = get_object_or_404(Solicitud, id=solicitud_id)
    data = json.loads(request.body)
    motivo = data.get('motivo')
    
    if motivo:
        solicitud.estado = 'finalizado'
        solicitud.progreso = 'completado'
        solicitud.motivo_rechazo = motivo
        solicitud.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'error': 'Se requiere un motivo de rechazo'})
def servicios(request):
    servicios_list = Servicio.objects.all()
    return render(request, 'products/servicios.html', {'servicios': servicios_list})


def is_servidor(user):
    return user.rol == 'Servidor'

@login_required
def mostrar_datos_usuario(request):
    usuario = request.user  # Obtener el usuario autenticado

    # Accediendo a los atributos
    direccion = usuario.direccion
    ciudad = usuario.ciudad
    provincia = usuario.provincia
    pais = usuario.pais

    return render(request, 'perfile/perfil_usuario.html', {
        'direccion': direccion,
        'ciudad': ciudad,
        'provincia': provincia,
        'pais': pais
    })
    
    
    
@login_required
@login_required
def solicitudes_usuario(request):
    if request.user.is_authenticated:
        # Obtener todas las solicitudes del usuario sin filtrar por estado
        solicitudes = Solicitud.objects.filter(usuario=request.user).values(
            'titulo', 'descripcion', 'estado', 'fecha_solicitud', 'id'
        )
        return JsonResponse(list(solicitudes), safe=False)
    else:
        return JsonResponse({'error': 'Usuario no autenticado'}, status=403)

    
@require_POST
def update_cover_photo(request):
    if request.FILES.get('cover_photo'):
        request.user.cover_photo = request.FILES['cover_photo']
        request.user.save()
        return JsonResponse({'status': 'success', 'message': 'Cover photo updated successfully'})
    return JsonResponse({'status': 'error', 'message': 'No file uploaded'}, status=400)



@login_required
def historial(request):
    user = request.user
    solicitudes = Solicitud.objects.filter(usuario=user).order_by('-fecha_solicitud')
    
    progreso_map = {
        'pendiente': 0,
        'en_proceso': 50,
        'completado': 100
    }

    activities = [{
        'type': 'Solicitud',
        'titulo': solicitud.titulo,
        'descripcion': solicitud.descripcion,
        'estado': solicitud.get_estado_display(),
        'fecha': solicitud.fecha_solicitud,
        'precio': solicitud.precio_acordado,
        'progreso': progreso_map.get(solicitud.progreso, 0),
        'aceptado_por': solicitud.aceptado_por.username if solicitud.aceptado_por else 'Nadie',
    } for solicitud in solicitudes]

    activities.sort(key=lambda x: x['fecha'], reverse=True)

    context = {
        'activities': activities,
        'user': user,
    }
    return render(request, 'dashboard/historial.html', context)




def ai_completion(request):
    if request.method == 'POST':
        # Lógica para procesar la solicitud POST
        data = {'message': 'AI completion response'}
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)



@login_required
def inbox(request):
    # Aquí puedes agregar la lógica para obtener los chats y mensajes del usuario
    context = {
        'chats': [
            {'name': 'Ana García', 'last_message': '¡Hola! ¿Cómo estás?', 'last_message_time': '10:30'},
            {'name': 'Carlos López', 'last_message': 'Gracias por la información', 'last_message_time': '09:15'},
            # Agrega más chats según sea necesario
        ],
        'active_chat': {'name': 'Ana García', 'status': 'En línea'},
        'messages': [
            {'content': '¡Hola! ¿Cómo estás?', 'timestamp': '10:30', 'is_sent': False},
            {'content': '¡Hola Ana! Todo bien, ¿y tú?', 'timestamp': '10:31', 'is_sent': True},
            {'content': 'Muy bien, gracias 😊', 'timestamp': '10:32', 'is_sent': False},
            # Agrega más mensajes según sea necesario
        ],
    }
    return render(request, 'messaging/inbox.html', context)


# views.py
from django.shortcuts import render

def custom_404(request, exception):
    return render(request, '404.html', status=404)
