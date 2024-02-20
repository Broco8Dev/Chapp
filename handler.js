let username = localStorage.getItem('username') || 'Anonymous';
let image = "";

let baseURL = "https://brocodev.pythonanywhere.com/"
// let baseURL = "http://localhost:5000/"

var messageLength;
var previousMessageLength = 0;

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

    messageLength = messages.length;

    if (messageLength > previousMessageLength) {
      messagesDiv.innerHTML = '';
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

        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const linkCheckerParts = message.split(linkRegex);

        if (linkCheckerParts.length > 1) {
          textTwo = textTwo.replace(linkRegex, '');
          textTwo += `\n<iframe src="${linkCheckerParts[1]}" width="400px" height="270px" style="border-radius: 10px; border: none;"></iframe>`;
          text = textOne + " " + `<span style="font-weight: semibold; font-size: 10px; opacity: 0.7;">` + textPart + `</span>` + "\n" + textTwo;
        }

        const base64Regex = /data:image[^'"\s]+/g;
        const base64Matches = message.match(base64Regex);

        if (base64Matches) {
          for (const match of base64Matches) {
            text = text.replace(match, '');
            text += `\n<img width="50%" style="border-radius: 10px;" src="${match}" alt="embedded-image" />`;
          }
        }

        messageElement.innerHTML = text;

        const imgElement = document.createElement('img');
        imgElement.classList.add('profile-picture');
        if (images[i] !== "DEFAULT_PFP") {
          imgElement.src = images[i];
        } else {
          imgElement.src = "data:image/png;base64,/9j/4AAQSkZJRgABAQACWAJYAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAyADIDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUIAwYHBAH/xAAyEAABAwQBAgMECgMAAAAAAAABAAIDBAUGEQchMRJBUQgUQnETFSIyVWJygZGzI2Gh/8QAGAEBAQEBAQAAAAAAAAAAAAAAAgADAQT/xAAaEQEBAAMBAQAAAAAAAAAAAAAAAQIRMSES/9oADAMBAAIRAxEAPwC+qIi9DIRQmV5pjGEUDbjk93ioopCWxNILpJXDuGMbtzv2Gh5qLw/lrAs6qnUGPXsOrGtLhTVEToZXNHctDvva89EkKTb0RFIREUhETupKW86ZBXX/AJOvTauRxitk5t9NGT0jjj6HQ/M7bj67WkUNwrLTWwXS3VD4KqjkbPBK06LHtOwQu4c78MZRNldZmOLWqa50dzImqIaZvilgm0A4+Du5rtbBG9EkHyWj4bwjnuWXWGkqcfrbXQF495rKyEwtjj39rwh2i92uwA799BLfmgs9XEsdwddrLb7q+MMdW0kNSWj4S9gcR/JXtWOmpoaOmho6ZnghgjbFG30Y0AAfwAsiJiIikKAzbN7DgNjkv1/nc2MO+jhhjG5aiQjYYweZ8yewHUqfPRU99obLajJORay2iUmisR9xgZvp4xoyv+Zd0+TQrrlunryj2leRL1Uv+pJ4LFSb/wAcdPG2SXX5pHg9f0gBRtp9oPla11DZpsk+smA/airqdkjXD02AHD9iucItPmM91c7inmSy8mQPpHQi33qnZ45qIv8AE17Oxkid8TfUHqN9djquhKgOOZBcMVvtDkdrkLKm3zNnZr4gPvNP+nN20j0Kvvb66C52+ludKdw1kEdRH+l7Q4f8KFmjl2zoiLhPo7j5qiHIvXkDJifxer/tciLuPRy411ERaMw9j8le/jkk8f4zv8IpP6moiOR4dbCiIgb/2Q==";
        }

        containerDiv.appendChild(imgElement);
        containerDiv.appendChild(messageElement);

        messagesDiv.appendChild(containerDiv);

        if (previousMessageLength !== messageLength) {
          previousMessageLength = messageLength;
          scrollDown.hasBeenExecuted = false;
          scrollDown();
        }
      }
    }

  } catch (error) {
    console.error('Error fetching messages:', error);
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

  
  message = newUsername + "\n" + message + " " + image;

  const input = document.getElementById('imageInput1');
  const imported = document.getElementById("imported");
  imported.innerHTML = '';
  messageInput.value = "";

  const profilePicture = localStorage.getItem('resizedProfilePicture') || 'DEFAULT_PFP';

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

  function importImage() {
    document.getElementById('imageInput1').click();
  }

  function convertImportedImage() {
    const input = document.getElementById('imageInput1');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Image = e.target.result;
            console.log('Base64 Image:', base64Image);
            image = base64Image;

            // Create an img element
            const img = document.createElement('img');

            // Set the src attribute after the onload event
            img.onload = function() {
                img.className = "importedImage"

                // Get the 'imported' element and append the img element to it
                const imported = document.getElementById("imported");
                imported.innerHTML = '';
                imported.appendChild(img);
            };

            // Set the src attribute to trigger the onload event
            img.src = base64Image;
        };
        reader.readAsDataURL(file);
    }
}




const intervalId = setInterval(fetchMessages,  300);

