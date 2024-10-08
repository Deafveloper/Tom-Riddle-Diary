const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3002' : 'https://your-production-url.com';

document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message !== '') {
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
    
    fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            addMessageToChat('Tom Riddle', data.response);
        } else {
            addMessageToChat('Tom Riddle', 'Error: Response not received.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        addMessageToChat('Tom Riddle', 'Error: Unable to fetch response.');
    });
}
