let username = localStorage.getItem('username') || 'Anonymous';

let baseURL = "https://brocodev.pythonanywhere.com/"

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

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];

      // Create a container div for each message
      const containerDiv = document.createElement('div');
      containerDiv.classList.add('message-container');

      const messageElement = document.createElement('p');
      messageElement.classList.add('posts');
      messageElement.textContent = message;

      const imgElement = document.createElement('img');
      imgElement.classList.add('profile-picture');
      imgElement.src = images[i] || 'default-profile-image.png';


      containerDiv.appendChild(imgElement);
      containerDiv.appendChild(messageElement);

      messagesDiv.appendChild(containerDiv);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
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

  newUsername = username + " @" + formattedTime + " " + formattedDate;

  
  message = newUsername + " : " + message 

  messageInput.value = "";


  const profilePicture = localStorage.getItem('resizedProfilePicture') || 'no';

  fetch(baseURL + "messages", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, profile_picture: profilePicture })
  }).then(response => {
    if (response.ok) {
      console.log('Message posted successfully');
    } else {
      console.log('Error posting message');
    }
  });

}

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

