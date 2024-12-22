from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from django.conf.urls.static import static
from django.conf import settings

handler404 = 'django.views.defaults.page_not_found'


# Declarar urlpatterns como una lista inicial
urlpatterns = [
     path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),  # Usa views.logout_view
    path('signup/', views.signup_view, name='signup'),
    path('home/', views.home, name='home'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

# Sección: Solicitudes
    path('editar_solicitud/<int:id>/', views.editar_solicitud, name='editar_solicitud'),
    path('eliminar_solicitud/<int:id>/', views.eliminar_solicitud, name='eliminar_solicitud'),
    path('crear_solicitud/', views.crear_solicitud, name='crear_solicitud'),
    path('api/solicitud/<int:solicitud_id>/cambiar-estado/', views.cambiar_estado_solicitud, name='cambiar_estado_solicitud'),
    path('api/solicitud/<int:solicitud_id>/rechazar/', views.rechazar_solicitud, name='rechazar_solicitud'),
    path('api/solicitudes-usuario/', views.solicitudes_usuario, name='solicitudes_usuario'),
    path('api/solicitudes/<int:solicitud_id>/actualizar-estado/', views.actualizar_estado, name='actualizar_estado'),
    path('solicitud/<int:solicitud_id>/', views.solicitud_detalle, name='solicitud_detalle'),
    path('api/solicitudes/<int:solicitud_id>/rechazar/', views.rechazar_solicitud, name='rechazar_solicitud'),



# Sección: Perfil del usuario

    path('profile/config/', views.profile_config, name='profile_config'),
    path('profile/config/', views.profile_config, name='profile_config'),
    path('profile/', views.profile, name='profile'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('profile/add-education/', views.add_education, name='add_education'),
    path('profile/add-experience/', views.add_experience, name='add_experience'),
    path('profile/add-payment-method/', views.add_payment_method, name='add_payment_method'),
    path('profile/change-password/', views.change_password, name='change_password'),
    path('edit-education/<int:id>/', views.edit_education, name='edit_education'),
    path('delete-education/<int:id>/', views.delete_education, name='delete_education'),
    path('edit-experience/<int:id>/', views.edit_experience, name='edit_experience'),
    path('delete-experience/<int:id>/', views.delete_experience, name='delete_experience'),
    path('update-cover-photo/', views.update_cover_photo, name='update_cover_photo'),
    path('delete_payment_method/<int:id>/', views.delete_payment_method, name='delete_payment_method'),
    # Otras rutas...
    path('edit-experience/<int:id>/', views.edit_experience, name='edit_experience'),
    path('delete-experience/<int:id>/', views.delete_experience, name='delete_experience'),


# Sección: Prestadores y servicios

    path('prestadores/', views.prestadores_dashboard, name='prestadores_dashboard'),
    path('servicios/', views.servicios, name='servicios'),

    

#seccion ia
    path('api/ai_completion', views.ai_completion, name='ai_completion'),

# Sección: Notificaciones y mensajes

    path('inbox/', views.inbox, name='inbox'),
    
    

# Sección: Otros
    
    path('pagina_cliente/', views.pagina_cliente, name='pagina_cliente'),
    path('historial/', views.historial, name='historial'),

    
    
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)