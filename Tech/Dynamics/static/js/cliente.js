document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const toggleFormButton = document.getElementById("toggleFormButton");
    const solicitudForm = document.getElementById("solicitudForm");
    const inputFoto = document.getElementById("id_foto");
    const imagenPreview = document.getElementById("imagenPreview");
    const searchInput = document.getElementById("searchInput");
    const orderSelect = document.getElementById("orderSelect");
    const editModal = document.getElementById("editModal");
    const confirmModal = document.getElementById("confirmModal");
    const saveEditBtn = document.getElementById("saveEditBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const solicitudesList = document.querySelector('.solicitudes-lista');

    let currentSolicitudId = null;

    // Funciones principales
    const toggleForm = () => {
        const isHidden = solicitudForm.style.display === "none" || solicitudForm.style.display === "";
        solicitudForm.style.display = isHidden ? "block" : "none";
        toggleFormButton.textContent = isHidden ? "Cancelar" : "Nueva Solicitud";
    };

    const handleImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement("img");
                img.src = event.target.result;
                img.style.maxWidth = "100%";
                img.style.height = "auto";
                imagenPreview.innerHTML = "";
                imagenPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };

    




    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const filterSolicitudes = () => {
        const searchTerm = searchInput.value.toLowerCase();
        document.querySelectorAll('.solicitud-item').forEach(item => {
            const titulo = item.querySelector('h3').textContent.toLowerCase();
            const descripcion = item.querySelector('p').textContent.toLowerCase();
            item.style.display = (titulo.includes(searchTerm) || descripcion.includes(searchTerm)) ? '' : 'none';
        });
    };

    const sortSolicitudes = () => {
        const sortOrder = orderSelect.value; // Obtiene el orden seleccionado
        const items = Array.from(document.querySelectorAll('.solicitud-item')); // Convierte los ítems en un array
    
        // Ordena los elementos en función de la fecha
        items.sort((a, b) => {
            const dateA = new Date(a.querySelector('p:last-of-type').textContent.replace('Fecha: ', ''));
            const dateB = new Date(b.querySelector('p:last-of-type').textContent.replace('Fecha: ', ''));
            return sortOrder === 'fecha_asc' ? dateA - dateB : dateB - dateA;
        });
    
        // Vacía la lista actual y añade los elementos ordenados
        solicitudesList.innerHTML = '';
        items.forEach(item => solicitudesList.appendChild(item));
    };

    

    const updateSolicitud = (id, titulo, descripcion) => {
        fetch(`/editar_solicitud/${id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ titulo, descripcion })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast("Solicitud editada con éxito", "success");
                editModal.style.display = 'none';
                const solicitudElement = document.querySelector(`.solicitud-item[data-id="${id}"]`);
                solicitudElement.querySelector('h3').textContent = titulo;
                solicitudElement.querySelector('p').textContent = descripcion;
            }
        })
        .catch(error => console.error('Error al actualizar la solicitud:', error));
    };

    const deleteSolicitud = (id) => {
        fetch(`/eliminar_solicitud/${id}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast("Solicitud eliminada con éxito", "success");
                confirmModal.style.display = 'none';
                document.querySelector(`.solicitud-item[data-id="${id}"]`).remove();
            }
        })
        .catch(error => console.error('Error al eliminar la solicitud:', error));
    };

    const showToast = (message, type = "success") => {
        const toast = document.getElementById("toast");
        const colors = {
            success: "#4caf50",
            error: "#f44336",
            info: "#2196f3"
        };
        toast.style.backgroundColor = colors[type] || "#4caf50";
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Event Listeners
toggleFormButton.addEventListener("click", toggleForm); // Muestra/Oculta formulario
if (inputFoto) inputFoto.addEventListener("change", handleImagePreview); // Previsualizar imagen
searchInput.addEventListener("input", debounce(filterSolicitudes, 300)); // Filtro de solicitudes con debounce
orderSelect.addEventListener("change", sortSolicitudes); // Ordenar solicitudes

    


    // Event listeners para edición y eliminación
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            currentSolicitudId = e.target.getAttribute('data-id');
            const solicitudItem = document.querySelector(`.solicitud-item[data-id="${currentSolicitudId}"]`);
            document.getElementById('editTitulo').value = solicitudItem.querySelector('h3').textContent;
            document.getElementById('editDescripcion').value = solicitudItem.querySelector('p').textContent;
            editModal.style.display = 'block';
        } else if (e.target.classList.contains('delete-btn')) {
            currentSolicitudId = e.target.getAttribute('data-id');
            confirmModal.style.display = 'block';
        }
    });

    saveEditBtn.addEventListener('click', () => {
        const titulo = document.getElementById('editTitulo').value;
        const descripcion = document.getElementById('editDescripcion').value;
        updateSolicitud(currentSolicitudId, titulo, descripcion);
    });

    confirmDeleteBtn.addEventListener('click', () => deleteSolicitud(currentSolicitudId));

    // Cerrar modales
    document.querySelectorAll('.close, .btn-secondary').forEach(element => {
        element.addEventListener('click', () => {
            editModal.style.display = 'none';
            confirmModal.style.display = 'none';
        });
    });
});
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

const csrftoken = getCookie('csrftoken');


const updateSolicitud = (id, titulo, descripcion) => {
    fetch(`/editar_solicitud/${id}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ titulo, descripcion })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showToast("Solicitud editada con éxito", "success");
            editModal.style.display = 'none';
            const solicitudElement = document.querySelector(`.solicitud-item[data-id="${id}"]`);
            solicitudElement.querySelector('h3').textContent = titulo;
            solicitudElement.querySelector('p').textContent = descripcion;
        } else {
            throw new Error(data.error || 'Error al actualizar la solicitud');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Error al editar la solicitud", "error");
    });
};


const deleteSolicitud = (id) => {
    fetch(`/eliminar_solicitud/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showToast("Solicitud eliminada con éxito", "success");
            confirmModal.style.display = 'none';
            document.querySelector(`.solicitud-item[data-id="${id}"]`).remove();
        } else {
            throw new Error(data.error || 'Error al eliminar la solicitud');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Error al eliminar la solicitud", "error");
    });
};


const solicitudForm = document.getElementById("solicitudForm");

solicitudForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const formData = new FormData(solicitudForm);
    
    fetch('/crear_solicitud/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Asegúrate de que el token CSRF se envíe
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            
            console.log('Solicitud creada con éxito', data);
            showToast("Solicitud creada con éxito", "success");  // Mostrar el toast de éxito
            solicitudForm.reset();


            // Esperar 3 segundos antes de recargar la página
            setTimeout(() => {
                window.location.reload();  // Recarga la página
            }, 900);  // 1000ms = 1 segundos
        } else {
            console.error('Error al crear solicitud:', data.error);
            showToast(`Error: ${data.error}`, "error");  // Mostrar el toast de error
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        showToast("Hubo un error al crear la solicitud", "error");  // Mostrar el toast de error
    });
});


function getCookie(name) {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
    return cookieValue;
}

const showToast = (message, type = "success") => {
    const toast = document.getElementById("toast");
    const colors = {
        success: "#4caf50",
        error: "#f44336",
        info: "#2196f3"
    };
    toast.style.backgroundColor = colors[type] || "#4caf50";
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
};

    document.getElementById('id_foto').addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                // Crear la imagen de vista previa
                var img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '200px'; // Limitar el tamaño de la vista previa
                document.getElementById('imagenPreview').innerHTML = ''; // Limpiar la vista previa anterior
                document.getElementById('imagenPreview').appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        const newRequestModal = document.getElementById('newRequestModal');
        const newRequestForm = document.getElementById('newRequestForm');
        const toggleFormButton = document.getElementById('toggleFormButton');
    
        // Mostrar el modal al hacer clic en "Nueva Solicitud"
        toggleFormButton.addEventListener('click', function () {
            newRequestModal.classList.add('show');
            newRequestModal.style.display = 'block';
        });
    
        // Ocultar el modal al hacer clic en "Cancelar" o fuera del modal
        const closeModalButtons = newRequestModal.querySelectorAll('.close, .btn-secondary');
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function () {
                closeModal(newRequestModal, newRequestForm);
            });
        });
    
        // Enviar el formulario
        newRequestForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evitar el envío tradicional
            const formData = new FormData(newRequestForm);
    
            fetch('/ruta-para-crear-solicitud/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken') // Añade el CSRF Token
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al crear la solicitud');
                }
            })
            .then(data => {
                // Acción después de crear la solicitud
                alert('Solicitud creada con éxito');
                closeModal(newRequestModal, newRequestForm);
                location.reload(); // Recargar la página para actualizar la lista
            })
            .catch(error => {
                console.error(error);
                alert('Hubo un error al crear la solicitud.');
            });
        });
    
        // Función para cerrar el modal y limpiar el formulario
        function closeModal(modal, form) {
            modal.classList.remove('show');
            modal.style.display = 'none';
            form.reset(); // Limpiar el formulario
        }
    });
    
    // Obtener el botón "Nueva Solicitud"
    const toggleButton = document.getElementById("toggleFormButton");

    // Cuando se abre el modal, cambiar el texto del botón a "Cerrar"
    const modal = document.getElementById("solicitudModal");
    modal.addEventListener('show.bs.modal', function () {
        toggleButton.innerHTML = '<i class="fas fa-times"></i> Cerrar Solicitud'; // Cambiar a "Cerrar"
    });

    // Cuando se cierra el modal, cambiar el texto del botón de vuelta a "Nueva Solicitud"
    modal.addEventListener('hidden.bs.modal', function () {
        toggleButton.innerHTML = '<i class="fas fa-plus"></i> Nueva Solicitud'; // Volver a "Nueva Solicitud"
    });


    document.getElementById('solicitudModal').addEventListener('shown.bs.modal', () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
    });
    




    document.addEventListener('DOMContentLoaded', function () {
        const solicitudesLista = document.querySelector('.solicitudes-lista');
        solicitudesLista.classList.add('lista'); // Aplica la clase 'lista' por defecto
    
        // Establecer el botón de lista como activo por defecto
        const listViewBtn = document.getElementById('listViewBtn');
        listViewBtn.classList.add('active');
    
        // Establecer el texto inicial en los botones
        const gridViewBtn = document.getElementById('gridViewBtn');
        gridViewBtn.classList.remove('active');
    });
    
    // Cambiar entre vista lista y cuadrícula
    document.getElementById('listViewBtn').addEventListener('click', function () {
        const solicitudesLista = document.querySelector('.solicitudes-lista');
        
        // Cambiar a vista lista
        solicitudesLista.classList.remove('cuadricula');
        solicitudesLista.classList.add('lista');
    
        // Actualizar el estado de los botones
        this.classList.add('active');
        document.getElementById('gridViewBtn').classList.remove('active');
    });
    
    document.getElementById('gridViewBtn').addEventListener('click', function () {
        const solicitudesLista = document.querySelector('.solicitudes-lista');
        
        // Cambiar a vista cuadrícula
        solicitudesLista.classList.remove('lista');
        solicitudesLista.classList.add('cuadricula');
    
        // Actualizar el estado de los botones
        this.classList.add('active');
        document.getElementById('listViewBtn').classList.remove('active');
    });
    






















    document.addEventListener('DOMContentLoaded', function() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        const historialContainer = document.getElementById('historialContainer');
        const historyTableBody = document.querySelector('#historyTab table tbody');
        const newRequestForm = document.getElementById('solicitudForm');
        const messageModal = document.getElementById('messageModal');
        const messageForm = document.getElementById('messageForm');
    
        // Función de cambio de tab
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(`${tabName}Tab`).classList.add('active');
                
                if (tabName === 'history') {
                    historialContainer.style.display = 'block';
                    cargarHistorialUsuario();
                } else {
                    historialContainer.style.display = 'none';
                }
            });
        });
    
        // Función para cargar el historial de solicitudes del usuario
        function cargarHistorialUsuario() {
            fetch('/api/solicitudes-usuario/')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cargar el historial');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.length === 0) {
                        historyTableBody.innerHTML = '<tr><td colspan="5">No hay solicitudes para mostrar.</td></tr>';
                    } else {
                        historyTableBody.innerHTML = data.map(solicitud => `
                            <tr>
                                <td>${solicitud.titulo}</td>
                                <td>${solicitud.descripcion}</td>
                                <td>${solicitud.estado}</td>
                                <td>${new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary message-btn" data-id="${solicitud.id}">
                                        <i class="fas fa-envelope"></i> Mensaje
                                    </button>
                                </td>
                            </tr>
                        `).join('');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    historyTableBody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
                });
        }
    
        
    
        // Mostrar mensajes y marcar como leídos
        function loadMessages() {
            fetch('/get_messages/')
                .then(response => response.json())
                .then(messages => {
                    const messageContainer = document.getElementById('messageContainer');
                    messageContainer.innerHTML = messages.map(message => `
                        <div class="message ${message.read ? 'read' : 'unread'}">
                            <p>${message.content}</p>
                            <small>From: ${message.sender_name} | ${new Date(message.timestamp).toLocaleString()}</small>
                            <button class="mark-read-btn" data-id="${message.id}">Marcar como leído</button>
                        </div>
                    `).join('');
                })
                .catch(error => console.error('Error loading messages:', error));
        }
    
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('mark-read-btn')) {
                const messageId = e.target.getAttribute('data-id');
                fetch(`/mark_message_as_read/${messageId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        e.target.closest('.message').classList.add('read');
                        e.target.remove();
                    }
                })
                .catch(error => console.error('Error marking message as read:', error));
            }
        });
    
        // Cargar mensajes al inicio y refrescar cada minuto
        loadMessages();
        setInterval(loadMessages, 60000); // Refrescar cada minuto
    
        // Función para obtener el CSRF Token de las cookies
        function getCookie(name) {
            const cookieValue = document.cookie.match('(^|;)\\s*' + name + '=([^;]*)');
            return cookieValue ? cookieValue.pop() : '';
        }
    
        // Función para mostrar notificaciones tipo toast
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = `toast ${type}`;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    
        // Inicializar la vista (mostrar "Mis Solicitudes" por defecto)
        document.querySelector('.tab-button[data-tab="requests"]').click();
    });
    
    console.log("Funcionalidad de solicitudes y mensajes inicializada.");
    