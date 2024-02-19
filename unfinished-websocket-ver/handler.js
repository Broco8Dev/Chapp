let username = localStorage.getItem('username') || 'Anonymous';

// let baseURL = "https://brocodev.pythonanywhere.com/"
let baseURL = "wss://localhost:5000"

var messageLength;
var previousMessageLength;

const socket = new WebSocket(baseURL);

socket.addEventListener('open', (event) => {
  console.log('WebSocket connection opened');
});

// Event handler for WebSocket messages
socket.addEventListener('message', (event) => {
  // Handle incoming messages here
  fetchMessages();
});

async function fetchMessages() {
  try {
    const [responseMessages, responseImages] = await Promise.all([
      fetch(baseURL + "messages"),
      fetch(baseURL + "images"),
    ]);

    const [messages, images] = await Promise.all([
      responseMessages.json(),
      responseImages.json(),
    ]);

    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    messageLength = messages.length;

    for (let i = 0; i < messageLength; i++) {
    const message = messages[i]

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('message-container');

    const messageElement = document.createElement('p');
    messageElement.classList.add('posts');

    const parts = message.split('\n');
    let textOne = parts[0].split('timestamp_split')[0];
    let textTwo = `<span style="font-weight: lighter; font-size: 15px;">${parts.slice(1).join('\n')}</span>`;
    let textPart = parts[0].split('timestamp_split')[1];
    let text = textOne + " " + `<span style="font-weight: semibold; font-size: 10px; opacity: 0.7;">` + textPart + `</span>` + "\n" + textTwo;
    messageElement.innerHTML = text;

    const imgElement = document.createElement('img');
    imgElement.classList.add('profile-picture');
    imgElement.src = images[i] || 'default-profile-image.png';

    containerDiv.appendChild(imgElement);
    containerDiv.appendChild(messageElement);

    messagesDiv.appendChild(containerDiv);

    if (previousMessageLength != messageLength) {
        previousMessageLength = messageLength;
        scrollDown.hasBeenExecuted = false;
        scrollDown();
    }
}

  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}

function sendMessage(message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket connection is not open.');
  }
}


function scrollDown() {
  if (scrollDown.hasBeenExecuted) {
    return;
  }

  const scrollingElement = document.getElementById("messages");

  const config = { childList: true };

  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        window.scrollBy(0, 4);
      }
    }

    scrollDown.hasBeenExecuted = true;

    observer.disconnect();
  };

  const observer = new MutationObserver(callback);
  observer.observe(scrollingElement, config);
}




function changeUsername() {
  var usernameInput = document.getElementById('usernameInput');
  var newUsername = usernameInput.value.trim();

  if (newUsername !== "") {
    username = newUsername;
    localStorage.setItem('username', username);
  } else {
    username = "Anonymous";
    localStorage.removeItem('username');
  }

  console.log("Username Changed to " + username);
}
function fillUsername() {
  var usernameInput = document.getElementById('usernameInput'); 
  usernameInput.value = username;
}

function postMessage() {
  username = localStorage.getItem('username') || 'Anonymous';
  var messageInput = document.getElementById('messageInput');
  var message = messageInput.value;

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

  newUsername = username + "timestamp_split" + formattedTime + " " + formattedDate;

  message = newUsername + "\n" + message;

  messageInput.value = "";

  const profilePicture = localStorage.getItem('resizedProfilePicture') || '/default-profile-image.png';

  // Instead of using fetch, send the message through WebSocket
  sendMessage({ message, profile_picture: profilePicture });
}

window.addEventListener('beforeunload', () => {
  socket.close();
});

socket.addEventListener('close', (event) => {
  console.log('WebSocket connection closed');
});

function switchPage(pageUrl, clickedImage) {
  var selectedNavbarImages = document.querySelectorAll('.selected-navbar-image');
  selectedNavbarImages.forEach(function (image) {
      image.classList.remove('selected-navbar-image');
      image.classList.add('navbar-image');
  });

  clickedImage.classList.add('selected-navbar-image');
  clickedImage.classList.remove('navbar-image');

  setTimeout(function () {
      clickedImage.classList.add('selected-navbar-image');
  }, 10);

  var iframe = document.getElementById('myIFrame');

  iframe.src = pageUrl;
}

function switchPageLegacy(pageUrl) {
    var iframe = document.getElementById('myIFrame');
    iframe.src = pageUrl;
}

document.getElementById('imageInput').addEventListener('change', handleImageSelect);

  function handleImageSelect(event) {
    const input = event.target;
    
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = 50;
          canvas.height = 50;
          ctx.drawImage(img, 0, 0, 50, 50);

          const resizedImageDataUrl = canvas.toDataURL('image/png');

          try {
            localStorage.setItem('resizedProfilePicture', resizedImageDataUrl);
            alert('Profile picture resized and saved successfully!');
          } catch (error) {
            console.error('Error saving resized image to localStorage:', error);
          }
        };
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

const intervalId = setInterval(fetchMessages,  300);

