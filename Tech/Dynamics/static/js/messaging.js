const notificationDetails = {
    1: {
      title: "Nueva actualización disponible",
      content: "Se ha lanzado la versión 2.0 de nuestra aplicación con nuevas características emocionantes:",
      extra: `
                      <ul style="margin-top: 1rem; margin-left: 1.5rem;">
                          <li>Interfaz mejorada</li>
                          <li>Mayor velocidad de respuesta</li>
                          <li>Nuevas funcionalidades de chat</li>
                          <li>Corrección de errores</li>
                      </ul>
                      <button style="margin-top: 1rem; padding: 0.5rem 1rem; background: #075e54; color: white; border: none; border-radius: 4px; cursor: pointer;">
                          Actualizar ahora
                      </button>
                  `
    },
    2: {
      title: "Recordatorio de reunión",
      content: "Tienes una reunión importante programada para hoy:",
      extra: `
                      <div style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px;">
                          <p><strong>Fecha:</strong> Hoy, 15:00</p>
                          <p><strong>Lugar:</strong> Sala de conferencias virtual</p>
                          <p><strong>Participantes:</strong> Equipo de desarrollo</p>
                          <p><strong>Agenda:</strong> Revisión de sprint</p>
                      </div>
                  `
    },
    3: {
      title: "¡Oferta especial limitada!",
      content: "Aprovecha este descuento exclusivo en nuestros servicios premium:",
      extra: `
                      <div style="margin-top: 1rem; text-align: center;">
                          <h3 style="color: #ff4444;">50% DE DESCUENTO</h3>
                          <p>Válido solo por las próximas 24 horas</p>
                          <button style="margin-top: 1rem; padding: 0.5rem 1rem; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
                              Obtener oferta
                          </button>
                      </div>
                  `
    }
  };
  document.querySelector('.notification-icon').addEventListener('click', function (e) {
      e.stopPropagation();
      const dropdown = document.getElementById('notifications-dropdown');
      dropdown.classList.toggle('active');
      document.getElementById('messages-dropdown').classList.remove('active');
      document.getElementById('overlay').classList.add('active');
      toggleBodyOverflow(); // Llamar para actualizar el estado de overflow

      if (dropdown.classList.contains('active')) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'auto';
      }
  });
  document.querySelector('.message-icon').addEventListener('click', function (e) {
      e.stopPropagation();
      const dropdown = document.getElementById('messages-dropdown');
      dropdown.classList.toggle('active');
      document.getElementById('notifications-dropdown').classList.remove('active');
      document.getElementById('overlay').classList.add('active');
      toggleBodyOverflow(); // Llamar para actualizar el estado de overflow

      if (dropdown.classList.contains('active')) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'auto';
      }
  });
  document.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', function () {
          const id = this.getAttribute('data-id');
          const detail = notificationDetails[id];
          document.getElementById('detail-title').textContent = detail.title;
          document.getElementById('detail-content').textContent = detail.content;
          document.getElementById('detail-extra').innerHTML = detail.extra;
          document.getElementById('overlay').classList.add('active');
          document.getElementById('notification-detail').classList.add('active');
          document.getElementById('notifications-dropdown').classList.remove('active');
      });
  });
  document.querySelector('.view-more').addEventListener('click', function () {
      alert('Cargando más notificaciones...');
  });
  document.getElementById('close-detail').addEventListener('click', function () {
      document.getElementById('overlay').classList.remove('active');
      document.getElementById('notification-detail').classList.remove('active');
  });
  document.getElementById('overlay').addEventListener('click', function () {
      document.getElementById('notifications-dropdown').classList.remove('active');
      document.getElementById('messages-dropdown').classList.remove('active');
      document.getElementById('overlay').classList.remove('active');
      document.getElementById('notification-detail').classList.remove('active');
      document.body.style.overflow = 'auto';
  });
  document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.addEventListener('click', function (e) {
          e.stopPropagation();
      });
      dropdown.querySelectorAll('button, a, .notification-item, .message-item, .view-more').forEach(element => {
          element.addEventListener('click', function (e) {
              e.stopPropagation();
          });
      });
  });
  document.querySelectorAll('.message-item').forEach(item => {
      item.addEventListener('click', function () {
          document.getElementById('chat-container').classList.add('active');
          document.getElementById('messages-dropdown').classList.remove('active');
      });
  });
  document.getElementById('close-chat').addEventListener('click', function () {
      document.getElementById('chat-container').classList.remove('active');
  });
  document.getElementById('send-message').addEventListener('click', sendMessage);
  document.getElementById('message-input').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
          sendMessage();
      }
  });
  function sendMessage() {
      const input = document.getElementById('message-input');
      const message = input.value.trim();
      if (message) {
          const chatMessages = document.getElementById('chat-messages');
          const messageDiv = document.createElement('div');
          messageDiv.className = 'message sent';
          messageDiv.textContent = message;
          chatMessages.appendChild(messageDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight;
          input.value = '';
          setTimeout(() => {
              const responseDiv = document.createElement('div');
              responseDiv.className = 'message received';
              responseDiv.textContent = '¡Gracias por tu mensaje! Te responderé pronto.';
              chatMessages.appendChild(responseDiv);
              chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 1000);
      }
  }
  document.querySelectorAll('.dropdown-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          document.getElementById('notifications-dropdown').classList.remove('active');
          document.getElementById('messages-dropdown').classList.remove('active');
          document.getElementById('overlay').classList.remove('active');
          document.body.style.overflow = 'auto';
      });
  });






  












  





