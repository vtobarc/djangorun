document.addEventListener('DOMContentLoaded', function() {
    const btnAceptar = document.getElementById('btn-aceptar');
    const btnEnProceso = document.getElementById('btn-en-proceso');
    const btnTerminar = document.getElementById('btn-terminar');
    const btnRechazar = document.getElementById('btn-rechazar');
    const modal = document.getElementById('rechazo-modal');
    const btnCancelarRechazo = document.getElementById('cancelar-rechazo');
    const btnConfirmarRechazo = document.getElementById('confirmar-rechazo');
    const motivoRechazo = document.getElementById('motivo-rechazo');
    const solicitudId = document.querySelector('.card').dataset.solicitudId;

    btnAceptar.addEventListener('click', () => actualizarEstado('en_proceso'));
    btnEnProceso.addEventListener('click', () => actualizarEstado('en_proceso'));
    btnTerminar.addEventListener('click', () => actualizarEstado('finalizado'));
    btnRechazar.addEventListener('click', () => modal.style.display = 'block');
    btnCancelarRechazo.addEventListener('click', () => modal.style.display = 'none');
    btnConfirmarRechazo.addEventListener('click', rechazarSolicitud);

    // Función para actualizar el estado de la solicitud
    function actualizarEstado(nuevoEstado) {
        fetch(`/api/solicitudes/${solicitudId}/actualizar-estado/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ estado: nuevoEstado })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Actualizar el estado en el DOM
                document.getElementById('estado-solicitud').textContent = data.estado;
                document.getElementById('progreso-solicitud').textContent = data.progreso;
                // Actualizar los botones según el nuevo estado
                actualizarBotones(nuevoEstado);
            } else {
                alert('Error al actualizar el estado: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Función para rechazar la solicitud
    function rechazarSolicitud() {
        fetch(`/api/solicitudes/${solicitudId}/rechazar/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ motivo: motivoRechazo.value })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Actualizar estado a 'Rechazado' en el DOM
                document.getElementById('estado-solicitud').textContent = 'Rechazado';
                document.getElementById('progreso-solicitud').textContent = 'Completado';
                // Actualizar los botones según el nuevo estado
                actualizarBotones('rechazado');
                modal.style.display = 'none';  // Cerrar el modal
            } else {
                alert('Error al rechazar la solicitud: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Función para habilitar o deshabilitar los botones según el estado de la solicitud
    function actualizarBotones(estado) {
        btnAceptar.disabled = estado !== 'pendiente';  // Solo habilitar "Aceptar" si el estado es pendiente
        btnEnProceso.disabled = estado === 'finalizado' || estado === 'rechazado';  // Deshabilitar "En Proceso" si ya está finalizado o rechazado
        btnTerminar.disabled = estado === 'finalizado' || estado === 'rechazado';  // Deshabilitar "Terminar" si ya está finalizado o rechazado
        btnRechazar.disabled = estado === 'finalizado' || estado === 'rechazado';  // Deshabilitar "Rechazar" si ya está finalizado o rechazado
    }

    // Función para obtener el valor de la cookie CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
