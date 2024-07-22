document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    if (message.trim() !== '') {
        addMessageToChat('You', message);
        messageInput.value = '';
        fetchResponse(message);
    }
});

function addMessageToChat(sender, message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function fetchResponse(userMessage) {
    fetch('/chat', { // Adjusted to root since it's the same domain
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {
        addMessageToChat('Tom Riddle', data.response);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
