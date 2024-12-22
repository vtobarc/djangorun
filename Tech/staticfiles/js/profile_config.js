document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profile-form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando...';

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                
            } else {
                alert('Error al actualizar el perfil. Por favor, revise los campos e intente nuevamente.');
                console.error(data.errors);
                // Display errors next to the corresponding fields
                Object.keys(data.errors).forEach(field => {
                    const errorElement = document.querySelector(`#id_${field} + .error-message`);
                    if (errorElement) {
                        errorElement.textContent = data.errors[field].join(', ');
                    } else {
                        const fieldElement = document.querySelector(`#id_${field}`);
                        if (fieldElement) {
                            const errorSpan = document.createElement('span');
                            errorSpan.className = 'error-message';
                            errorSpan.textContent = data.errors[field].join(', ');
                            fieldElement.parentNode.insertBefore(errorSpan, fieldElement.nextSibling);
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al actualizar el perfil. Por favor, intente nuevamente.');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar cambios';
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profile-form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Guardando...';

        const formData = new FormData(form);

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                showNotification('Perfil actualizado con éxito', 'success');
            } else {
                showNotification('Error al actualizar el perfil. Por favor, revise los campos e intente nuevamente.', 'error');
                displayErrors(data.errors);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Ocurrió un error al actualizar el perfil. Por favor, intente nuevamente.', 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar cambios';
        });
    });

    function displayErrors(errors) {
        Object.keys(errors).forEach(field => {
            const fieldElement = document.querySelector(`#id_${field}`);
            if (fieldElement) {
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error-message';
                errorSpan.textContent = errors[field].join(', ');
                fieldElement.parentNode.insertBefore(errorSpan, fieldElement.nextSibling);
            }
        });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profile-form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Guardando...';

        const formData = new FormData(form);

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                showNotification('Perfil actualizado con éxito', 'success');
            } else {
                if (data.errors && Object.keys(data.errors).length > 0) {
                    displayErrors(data.errors);
                    showNotification('Por favor, corrija los errores en el formulario.', 'error');
                } else {
                    showNotification('Error al actualizar el perfil. Por favor, intente nuevamente.', 'error');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Ocurrió un error al actualizar el perfil. Por favor, intente nuevamente.', 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Guardar cambios';
        });
    });

    function displayErrors(errors) {
        const generalErrorsContainer = document.getElementById('general-errors');
        generalErrorsContainer.innerHTML = ''; // Limpiar errores anteriores

        Object.keys(errors).forEach(field => {
            if (field === 'non_field_errors' || field === '__all__') {
                // Errores generales
                const errorItem = document.createElement('li');
                errorItem.textContent = errors[field].join(', ');
                generalErrorsContainer.appendChild(errorItem);
            } else {
                // Errores específicos de campo
                const fieldElement = document.querySelector(`#id_${field}`);
                if (fieldElement) {
                    const errorSpan = fieldElement.nextElementSibling;
                    if (errorSpan && errorSpan.classList.contains('error-message')) {
                        errorSpan.textContent = errors[field].join(', ');
                    } else {
                        const newErrorSpan = document.createElement('span');
                        newErrorSpan.className = 'error-message';
                        newErrorSpan.textContent = errors[field].join(', ');
                        fieldElement.parentNode.insertBefore(newErrorSpan, fieldElement.nextSibling);
                    }
                }
            }
        });

        if (generalErrorsContainer.children.length > 0) {
            generalErrorsContainer.style.display = 'block';
        } else {
            generalErrorsContainer.style.display = 'none';
        }
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});






  document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Add your form submission logic here
    const generalErrors = document.getElementById('general-errors');
    generalErrors.style.display = 'block';
    generalErrors.innerHTML = '<li>Error 1</li><li>Error 2</li>';

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

