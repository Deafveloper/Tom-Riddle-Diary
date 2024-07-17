document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#chat-form');
    const input = document.querySelector('#message-input');
    const chatWindow = document.querySelector('#chat-window');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const message = input.value;
        if (message.trim() !== '') {
            addMessageToChat('You', message);
            input.value = '';
            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            })
            .then(response => response.json())
            .then(data => {
                addMessageToChat('Tom Riddle', data.response);
            });
        }
    });

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatWindow.appendChild(messageElement);
    }
});
