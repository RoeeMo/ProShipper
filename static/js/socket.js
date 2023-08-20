const socket = io(`${document.location.origin}/`);
socket.on('conncetion');
const user = document.getElementById("username").textContent;
// sort incoming messages from socket
socket.on('message', ({ message, username }) => {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');

  if (username === user) {
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

// Send a message
function sendMessage() {
  const messageText = document.getElementById("message-input").value;
  socket.emit('message', messageText);
  document.getElementById("message-input").value = '';
};

document.addEventListener('DOMContentLoaded', () => {
  // If the user pressed enter
  const messageInput = document.getElementById("message-input");
  messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
  }
  // If the user pressed the "send " button
  const sendButton = document.getElementById('send-button');
  sendButton.addEventListener('click', (e) => {
    e.preventDefault;
    sendMessage();
  })
  });

  // Scroll to the last message element when the page first loads
  const lastMessageContainer = document.querySelector('#messages-block .message-container:last-child');
  if (lastMessageContainer) {
    lastMessageContainer.scrollIntoView();
  }
});