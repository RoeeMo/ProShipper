const cookieUsername = (document.cookie?.split("; "))?.find(str => str.startsWith("username="))?.split("=")[1];

const socket = io('http://localhost:3000');
socket.on('conncetion');

// sort incoming messages from socket
socket.on('message', ({ message, username }) => {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');

  if (username === cookieUsername) {
    messageContainer.classList.add('message-sent');
  } else {
    messageContainer.classList.add('message-received');
  }
  const usernameContainer = document.createElement('div');
  usernameContainer.classList.add('username');
  usernameContainer.textContent = username;
  messageContainer.appendChild(usernameContainer);

  const messageText = document.createElement('div');
  messageText.classList.add('message-text');
  messageText.textContent = message;
  messageContainer.appendChild(messageText);
  document.getElementById('messages-block').appendChild(messageContainer);
});

// send a message
function sendMessage() {
  const messageText = document.querySelector('.message').value;
  socket.emit('message', messageText);
};

document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById("message-input");
    messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // prevent the default form submission behavior
        sendMessage();
    }
    });
});