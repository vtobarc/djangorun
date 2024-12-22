let uniqueUserRating = 0;
let uniqueAutoReplyTimeout = null;
let uniqueIsUserBlocked = false;
let uniqueNotifications = [];
let uniqueUnreadCount = 0;
let uniqueUnreadChatCount = 0;

function uniqueToggleNotifications() {
  const dropdown = document.getElementById('uniqueNotificationsDropdown');
  dropdown.classList.toggle('show');
  if (uniqueNotifications.length === 0) {
    dropdown.innerHTML = '<div class="unique-notification-item">No hay notificaciones nuevas</div>';
  }
  uniqueUnreadCount = 0;
  uniqueUpdateNotificationBadge();
}

function uniqueAddNotification(message, chatId, type = 'message') {
  uniqueNotifications.unshift({
    message,
    chatId,
    timestamp: new Date(),
    type
  });
  uniqueUnreadCount++;
  uniqueUpdateNotificationBadge();
  uniqueUpdateNotificationsDropdown();
}

function uniqueUpdateNotificationBadge() {
  const badge = document.getElementById('uniqueNotificationBadge');
  if (uniqueUnreadCount > 0) {
    badge.style.display = 'block';
    badge.textContent = uniqueUnreadCount;
  } else {
    badge.style.display = 'none';
  }
}

function uniqueUpdateNotificationsDropdown() {
  const dropdown = document.getElementById('uniqueNotificationsDropdown');
  dropdown.innerHTML = uniqueNotifications.map((notif, index) => {
    let icon = '💬';
    let backgroundColor = '#fff';
    switch (notif.type) {
      case 'message':
        icon = '💬';
        backgroundColor = '#e3f2fd';
        break;
      case 'alert':
        icon = '⚠️';
        backgroundColor = '#fff3cd';
        break;
      case 'chat':
        icon = '💬';
        backgroundColor = '#d5f5e3';
        break;
    }
    return `
      <div class="unique-notification-item" style="background-color: ${backgroundColor}">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>${icon}</span>
          <div>
            ${notif.message}
            <div class="unique-chat-preview-time">
              ${notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function uniqueToggleChat() {
  const chatModal = document.getElementById('uniqueChatModal');
  chatModal.style.display = chatModal.style.display === 'flex' ? 'none' : 'flex';
  if (chatModal.style.display === 'flex') {
    uniqueUnreadCount = 0;
    uniqueUpdateNotificationBadge();
  }
}

function uniqueAutoReply(messageText) {
  const autoResponses = ["¡Gracias por tu mensaje! Te responderé pronto.", "¡Hola! En este momento estoy ocupado(a), pero te contestaré lo antes posible.", "He recibido tu mensaje. Me pondré en contacto contigo pronto.", "¡Gracias por escribir! Te responderé en cuanto pueda."];
  clearTimeout(uniqueAutoReplyTimeout);
  uniqueAutoReplyTimeout = setTimeout(() => {
    const response = autoResponses[Math.floor(Math.random() * autoResponses.length)];
    const currentChatName = document.querySelector('.unique-chat-header-info h2').textContent;
    const messagesContainer = document.querySelector('.unique-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'unique-message';
    messageDiv.innerHTML = `
      <div class="unique-message-bubble">${response}</div>
      <div class="unique-message-time">${new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    uniqueAddNotification(`Nuevo mensaje de ${currentChatName}`, 'chat' + Date.now(), 'chat');
  }, 1000);
}


function uniqueUpdateChatNotificationBadge() {
  const badge = document.getElementById('uniqueChatNotificationBadge');
  if (uniqueUnreadChatCount > 0) {
    badge.style.display = 'block';
    badge.textContent = uniqueUnreadChatCount;
  } else {
    badge.style.display = 'none';
  }
}

function uniqueAddChatNotification() {
  uniqueUnreadChatCount++;
  uniqueUpdateChatNotificationBadge();
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
  // Simulating new notifications
  setTimeout(() => uniqueAddNotification('Nuevo mensaje de Juan', 'message1', 'message'), 2000);
  setTimeout(() => uniqueAddNotification('Actualización importante del sistema', 'alert1', 'alert'), 4000);
  // Initialize chat functionality
  uniqueInitializeChatPreviews();
});

function uniqueInitializeChatPreviews() {
  // Placeholder for chat preview initialization logic.  This would typically involve fetching and displaying chat previews.
}

