document.getElementById("cover").addEventListener("click", function() {
    document.getElementById("book").classList.add("open");
});

function sendMessage() {
    const userInput = document.getElementById("user_input").value;
    const messagesDiv = document.getElementById("messages");
    
    const userMessageDiv = document.createElement("div");
    userMessageDiv.textContent = "You: " + userInput;
    messagesDiv.appendChild(userMessageDiv);
    
    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `user_input=${encodeURIComponent(userInput)}`,
    })
    .then(response => response.json())
    .then(data => {
        const responseMessageDiv = document.createElement("div");
        responseMessageDiv.textContent = "Tom Riddle: " + data.response;
        messagesDiv.appendChild(responseMessageDiv);
        document.getElementById("user_input").value = '';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}
