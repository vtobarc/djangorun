const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');

let isOpen = false;

function toggleChat() {
  isOpen = !isOpen;
  chatWindow.classList.toggle('active');
  if (isOpen) {
    userInput.focus();
  }
}

chatButton.addEventListener('click', toggleChat);

function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  messageDiv.textContent = message;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getAIResponse(message) {
  try {
    const response = await fetch('/api/ai_completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Respond as a helpful assistant to: ${message}
        
        <typescript-interface>
        interface Response {
          reply: string;
        }
        </typescript-interface>
        
        <example>
        {
          "reply": "¡Claro! Puedo ayudarte con eso. ¿Qué más te gustaría saber?"
        }
        </example>`,
        data: message
      })
    });
    const data = await response.json();
    return data.reply;
  } catch (error) {
    return "Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?";
  }
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  userInput.value = '';

  // Show typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message';
  typingDiv.textContent = 'Escribiendo...';
  chatMessages.appendChild(typingDiv);

  // Get AI response
  const response = await getAIResponse(message);
  chatMessages.removeChild(typingDiv);
  addMessage(response);
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Add bounce animation to chat button periodically
setInterval(() => {
  chatButton.classList.add('bounce');
  setTimeout(() => chatButton.classList.remove('bounce'), 2000);
}, 10000);