async function initiateChat(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value;
    
    const requestData = {
      username: username
    };
    try {
        const response = await fetch('/chat/initiate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
    
        console.log('Response:', typeof response);
        // Loop through the messages and populate the chat messages section
        // const messagesBlock = document.getElementById('messages-block');

        // messagesJson.messages.forEach(messageData => {
        // const { sender, text } = messageData;

        // const messageContainer = document.createElement('div');
        // messageContainer.classList.add('message-container');

        // if (sender === serverData.username) {
        //     messageContainer.classList.add('message-sent');
        // } else {
        //     messageContainer.classList.add('message-received');
        // }

        // const usernameContainer = document.createElement('div');
        // usernameContainer.classList.add('username');
        // usernameContainer.textContent = sender;
        // messageContainer.appendChild(usernameContainer);

        // const messageText = document.createElement('div');
        // messageText.classList.add('message-text');
        // messageText.textContent = text;
        // messageContainer.appendChild(messageText);

        // messagesBlock.appendChild(messageContainer);
        // });

        // // Scroll to the last message
        // messagesBlock.lastElementChild.scrollIntoView();
    } catch (err) {
        console.error('Error:', err);
    }
};



async function sendUsernameRequest(username) {
    try {
        const response = fetch('/chat', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        })
    } catch (err) {
        console.log(err);
    }
};
