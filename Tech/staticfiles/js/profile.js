document.addEventListener('DOMContentLoaded', function () {
    // Manejo de pestañas
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            
            // Remover clase 'active' de todos los botones
            navButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Agregar clase 'active' al botón y al contenido correspondiente
            this.classList.add('active');
            const targetContent = document.getElementById(target);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    
    // Cambio de foto de perfil
    const changeProfilePictureBtn = document.getElementById('change-profile-picture');
    if (changeProfilePictureBtn) {
        changeProfilePictureBtn.addEventListener('click', function () {
            // Implementar la lógica para cambiar la foto de perfil
            console.log('Cambiar foto de perfil');
        });
    }

    // Manejo de formulario de perfil
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    setTimeout(() => location.reload(), 2000);
                } else {
                    let errorMessage = 'Error al actualizar el perfil:\n';
                    for (const [field, errors] of Object.entries(data.errors)) {
                        errorMessage += `${field}: ${errors.join(', ')}\n`;
                    }
                    showNotification(errorMessage, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Ocurrió un error al actualizar el perfil. Por favor, inténtalo de nuevo.', 'error');
            });
        });
    }

    // Función para obtener el token CSRF
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

    // Función para mostrar notificaciones
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        document.body.appendChild(notification);
        
        // Eliminar notificación después de 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
});




document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar la navegación por pestañas
    function initializeTabs() {
        const navButtons = document.querySelectorAll('.nav-button');
        const tabContents = document.querySelectorAll('.tab-content');

        // Ocultar todas las pestañas excepto la activa al cargar
        tabContents.forEach(content => {
            if (!content.classList.contains('active')) {
                content.style.display = 'none';
            }
        });

        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover clase active de todos los botones
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                
                // Obtener el target del contenido
                const targetId = this.getAttribute('data-target');
                
                // Ocultar todos los contenidos
                tabContents.forEach(content => {
                    content.style.display = 'none';
                    content.classList.remove('active');
                });
                
                // Mostrar el contenido seleccionado
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // Manejar el envío del formulario
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification(data.message, 'success');
                    // Esperar 2 segundos antes de recargar
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    let errorMessage = 'Error al actualizar el perfil:\n';
                    for (const [field, errors] of Object.entries(data.errors)) {
                        errorMessage += `${field}: ${errors.join(', ')}\n`;
                    }
                    showNotification(errorMessage, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Ocurrió un error al actualizar el perfil. Por favor, inténtalo de nuevo.', 'error');
            });
        });
    }

    // Función para obtener el token CSRF
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

    // Función para mostrar notificaciones
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px';
        notification.style.borderRadius = '4px';
        notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
        notification.style.color = 'white';
        notification.style.zIndex = '1000';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Inicializar las pestañas
    initializeTabs();
});


document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
        });
    });

    const changeCoverBtn = document.getElementById('change-cover');
    const changeProfilePictureBtn = document.getElementById('change-profile-picture');

    changeCoverBtn.addEventListener('click', function() {
        // Implement cover image change functionality
        console.log('Change cover image');
    });

    changeProfilePictureBtn.addEventListener('click', function() {
        // Implement profile picture change functionality
        console.log('Change profile picture');
    });

    const addEducationBtn = document.getElementById('add-education');
    const addExperienceBtn = document.getElementById('add-experience');
    const addPaymentMethodBtn = document.getElementById('add-payment-method');

    addEducationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Implement add education functionality
        console.log('Add education');
    });

    addExperienceBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Implement add experience functionality
        console.log('Add experience');
    });

    addPaymentMethodBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Implement add payment method functionality
        console.log('Add payment method');
    });
});


function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px';
    notification.style.borderRadius = '4px';
    notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.5s ease-in-out';
    notification.style.opacity = '1';

    // Añadir la notificación al contenedor
    notificationContainer.appendChild(notification);

    // Desvanecer y eliminar la notificación después de 5 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500); // Esperar a que termine la transición antes de eliminar
    }, 5000);
}



$('#edit-education-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Botón que activó el modal
    var id = button.data('id');
    var institucion = button.data('institucion');
    var titulo = button.data('titulo');
    var fecha_inicio = button.data('fecha_inicio');
    var fecha_fin = button.data('fecha_fin');

    var modal = $(this);
    modal.find('#education-id').val(id);
    modal.find('#institucion').val(institucion);
    modal.find('#titulo').val(titulo);
    modal.find('#fecha_inicio').val(fecha_inicio);
    modal.find('#fecha_fin').val(fecha_fin);
});









document.addEventListener('DOMContentLoaded', function() {
    const changeCoverBtn = document.getElementById('change-cover');
    const coverPhotoInput = document.getElementById('cover-photo-input');
    const coverPhotoImg = document.getElementById('cover-photo');
    const coverPhotoForm = document.querySelector('form[enctype="multipart/form-data"]');

    changeCoverBtn.addEventListener('click', function() {
        coverPhotoInput.click();
    });

    coverPhotoInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                coverPhotoImg.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);

            // Automatically submit the form when a file is selected
            const formData = new FormData(coverPhotoForm);
            
            fetch(coverPhotoForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification('Foto de portada actualizada con éxito', 'success');
                } else {
                    showNotification('Error al actualizar la foto de portada', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Ocurrió un error al actualizar la foto de portada', 'error');
            });
        }
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

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px';
        notification.style.borderRadius = '4px';
        notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
        notification.style.color = 'white';
        notification.style.zIndex = '1000';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
});




