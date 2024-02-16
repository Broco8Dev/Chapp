let username = "";

let baseURL = "https://brocodev.pythonanywhere.com/"

function fetchMessages() {
  Promise.all([
    fetch(baseURL + "messages"),
  ]).then(([responseMessages]) => {
    return Promise.all([
      responseMessages.json(),
    ]);
  }).then(([messages]) => {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    messages.forEach((message) => {
      const combinedText = message;
      const messageElement = document.createElement('p');
      messageElement.textContent = combinedText;
      messagesDiv.appendChild(messageElement);
    });
  });
}

function postMessage() {
  var messageInput = document.getElementById('messageInput'); 
  var message = messageInput.value;

  var usernameInput = document.getElementById('usernameInput'); 
  username = usernameInput.value;

  if(username == "") {
      username = "Anonymous"
  }


  var currentDate = new Date();

  var formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
  
  var formattedDate = currentDate.toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'numeric',
  year: '2-digit'
  });

  username = username + " @" + formattedTime + " " + formattedDate;

  
  message = username + " : " + message 

  messageInput.value = "";

  fetch(baseURL + "messages", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  }).then(response => {
    if (response.ok) {
      console.log('Message posted successfully');
    } else {
      console.log('Error posting message');
    }
  });
}

const intervalId = setInterval(fetchMessages,  300);