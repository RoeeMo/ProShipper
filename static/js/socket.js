const cookieUsername = (document.cookie?.split("; "))?.find(str => str.startsWith("username="))?.split("=")[1];

const socket = io('https://proshipper-l8mb.onrender.com/');
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

  // Scroll to the last message
  messageContainer.scrollIntoView();
});

// send a message
function sendMessage() {
  const messageText = document.querySelector('.message').value;
  socket.emit('message', messageText);
  document.querySelector('.message').value = '';
};

document.addEventListener('DOMContentLoaded', () => {
  const messageInput = document.getElementById("message-input");
  messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
      event.preventDefault(); // prevent the default form submission behavior
      sendMessage();
  }
  });

  // Scroll to the last message element when the page first loads
  const lastMessageContainer = document.querySelector('#messages-block .message-container:last-child');
  if (lastMessageContainer) {
    lastMessageContainer.scrollIntoView();
  }
});