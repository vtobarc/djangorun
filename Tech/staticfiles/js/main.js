const loginUrl = "{% url 'login' %}";  // Aquí Django genera la URL correctamente

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('#loginForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevenir que el formulario se envíe de manera tradicional

        // Obtener los datos del formulario
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Obtener el token CSRF del DOM
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Crear un objeto FormData
        const formData = new FormData();
        formData.append('username', username); 
        formData.append('password', password);
        formData.append('csrfmiddlewaretoken', csrfToken);  // Incluir el token CSRF

        // Enviar los datos a través de AJAX
        fetch(loginUrl, {
            method: "POST",
            body: formData,
            headers: {
                'X-CSRFToken': csrfToken  // Incluir el token CSRF en las cabeceras
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirigir a la página de inicio
                window.location.href = "/home";  // Cambia esto según tu URL de destino
            } else {
                // Mostrar un mensaje de error
                alert(data.message || 'Invalid login credentials');
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert('There was an error with your request');
        });
    });
});


document.getElementById('menu-toggle').addEventListener('click', function() {
    this.classList.toggle('active');
});



















document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
  
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  
    
  
   
  
    
  
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
  
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const icon = themeToggle.querySelector('i');
      icon.classList.toggle('fa-sun');
      icon.classList.toggle('fa-moon');
    });
  
    // Profile dropdown
  // Perfil dropdown
const profileBtn = document.getElementById('profile-btn');
const profileDropdown = document.getElementById('profile-dropdown');
const profileLinks = profileDropdown.querySelectorAll('.profile-menu a'); // Enlaces dentro del menú de perfil

// Mostrar u ocultar el menú de perfil
profileBtn.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevenir que el clic cierre el dropdown inmediatamente
  profileDropdown.classList.toggle('show');
});

// Cerrar el menú de perfil cuando se haga clic en un enlace dentro del menú
profileLinks.forEach(link => {
  link.addEventListener('click', () => {
    profileDropdown.classList.remove('show'); // Cierra el dropdown cuando se hace clic en cualquier enlace
  });
});

// Cerrar el menú de perfil si se hace clic fuera de él
window.addEventListener('click', (event) => {
  if (!profileBtn.contains(event.target) && !profileDropdown.contains(event.target)) {
    profileDropdown.classList.remove('show');
  }
});

        
  });




  document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navMenu = document.getElementById('nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('show');
        }
    });

   
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!profileBtn.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.remove('show');
        }
    });
});


 