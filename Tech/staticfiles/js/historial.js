
function renderActivities(filteredActivities = activities) {
  const activitiesContainer = document.getElementById('activities');
  activitiesContainer.innerHTML = filteredActivities.map(activity => createActivityCard(activity)).join('');
}
function sortActivities(direction) {
  const sorted = [...activities].sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
  renderActivities(sorted);
}
function filterByDate(date) {
  if (!date) {
    renderActivities();
    return;
  }
  const filtered = activities.filter(activity => {
    const activityDate = new Date(activity.fecha).toISOString().split('T')[0];
    return activityDate === date;
  });
  renderActivities(filtered);
}
document.querySelector('.search-bar').addEventListener('input', e => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = activities.filter(activity => activity.solicitud.toLowerCase().includes(searchTerm) || activity.descripcion.toLowerCase().includes(searchTerm));
  renderActivities(filtered);
});
// base.js o dentro de un <script> en base.html
// base.js o dentro de un <script> en base.html

// Función para abrir el chat y cambiar el título
function openChat(serverName) {
    // Mostrar el contenedor del chat
    const chatContainer = document.getElementById('chat-container');
    chatContainer.style.display = 'block';
    
    // Cambiar el título del chat al nombre del servidor
    const chatTitle = document.getElementById('chat-title');
    chatTitle.textContent = `Chat con ${serverName}`;
}

// Función para cerrar el chat
function closeChat() {
    // Ocultar el contenedor del chat
    const chatContainer = document.getElementById('chat-container');
    chatContainer.style.display = 'none';
}




document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', e => {
    const rating = e.target.dataset.rating;
    document.querySelectorAll('.star').forEach(s => {
      s.classList.remove('active');
      if (s.dataset.rating <= rating) {
        s.classList.add('active');
      }
    });
  });
});
function reportServer(serverName) {
  openReportModal(serverName);
}
function openReportModal(serverName) {
  const modal = document.getElementById('reportModal');
  modal.style.display = 'flex';
  modal.dataset.serverName = serverName;
}
function closeReportModal() {
  document.getElementById('reportModal').style.display = 'none';
  document.getElementById('reportForm').reset();
  document.getElementById('fileList').innerHTML = '';
}
function handleFiles(files) {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';
  Array.from(files).forEach(file => {
    const fileItem = document.createElement('div');
    fileItem.textContent = `📄 ${file.name}`;
    fileList.appendChild(fileItem);
  });
}
function submitReport(event) {
  event.preventDefault();
  const serverName = document.getElementById('reportModal').dataset.serverName;
  const description = document.getElementById('reportDescription').value;
  const files = document.getElementById('reportFiles').files;
  console.log('Report submitted:', {
    serverName,
    description,
    files: Array.from(files).map(f => f.name)
  });
  closeReportModal();
}

renderActivities();




function filterByDateRange() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      alert('La fecha inicial debe ser anterior a la fecha final');
      return;
    }
    console.log('Filtering between:', startDate, 'and', endDate);
  }
}
function searchActivities() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const activities = document.querySelectorAll('.list-group-item');
  activities.forEach(activity => {
    const text = activity.textContent.toLowerCase();
    activity.style.display = text.includes(searchTerm) ? '' : 'none';
  });
}
function sortActivities(order) {
  const activitiesList = document.getElementById('activitiesList');
  const activities = Array.from(activitiesList.children);
  activities.sort((a, b) => {
    const dateA = new Date(a.querySelector('.text-muted').textContent.replace('📅 ', ''));
    const dateB = new Date(b.querySelector('.text-muted').textContent.replace('📅 ', ''));
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
  activities.forEach(activity => {
    activity.style.opacity = '0';
    setTimeout(() => {
      activitiesList.appendChild(activity);
      requestAnimationFrame(() => {
        activity.style.opacity = '1';
      });
    }, 200);
  });
}


function reportServer(servidor) {
  document.getElementById('reportModal').style.display = 'block';
}
function closeReportModal() {
  document.getElementById('reportModal').style.display = 'none';
}
function handleFiles(files) {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';
  Array.from(files).forEach(file => {
    const item = document.createElement('div');
    item.textContent = file.name;
    fileList.appendChild(item);
  });
}
function submitReport(event) {
  event.preventDefault();
  const notification = document.getElementById('notification');
  notification.style.display = 'block';
  closeReportModal();
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

  star.addEventListener('click', e => {
    const rating = e.target.dataset.rating;
    document.querySelectorAll('.star').forEach(s => {
      s.classList.toggle('active', s.dataset.rating <= rating);
    });
  });




  

  document.addEventListener('DOMContentLoaded', function() {
    const progressContainers = document.querySelectorAll('.progress-container');
  
    progressContainers.forEach(container => {
      const progressFill = container.querySelector('.progress-fill');
      const progressValue = container.querySelector('.progress-value');
      const estadoValor = container.closest('.list-group-item').querySelector('.estado-valor');
      
      let rawProgress = progressValue.textContent.trim();
      let estadoTexto = estadoValor.textContent.trim();
  
      // Convertir el progreso a un número entre 0 y 100
      let progressPercentage;
      if (rawProgress === 'Iniciado' || estadoTexto === 'Iniciado') {
        progressPercentage = 0;
      } else if (rawProgress === 'En Proceso' || estadoTexto === 'En Proceso') {
        progressPercentage = 50;
      } else if (rawProgress === 'Finalizado' || estadoTexto === 'Finalizado') {
        progressPercentage = 100;
      } else {
        // Intenta convertir directamente si es un número
        progressPercentage = parseInt(rawProgress, 10);
        if (isNaN(progressPercentage)) {
          progressPercentage = 0;
        }
      }
  
      // Actualizar la barra de progreso
      progressFill.style.width = `${progressPercentage}%`;
  
      // Actualizar el texto del progreso
      progressValue.textContent = `${progressPercentage}%`;
    });
  });
  
  