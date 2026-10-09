
const msgEl = document.getElementById('msg');

// Generate random number
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

const randomNum = getRandomNumber();
console.log('Number:', randomNum);

// Set up speech recognition
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
  msgEl.textContent =
    'Speech recognition is not supported. Please use Google Chrome.';
} else {
  const recognition = new window.SpeechRecognition();
  let gameOver = false;
  let isListening = false;

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  // Start listening to the user
  function startListening() {
    if (!gameOver && !isListening) {
      try {
        recognition.start();
        isListening = true;
      } catch (error) {
        console.log('Could not start recognition:', error);
      }
    }
  }

  // Capture what the user says
  function onSpeak(event) {
    const msg = event.results[0][0].transcript
      .trim()
      .toLowerCase();

    console.log('You said:', msg);

    // Display the recognized speech
    writeMessage(msg);

    // Check the spoken number
    checkNumber(msg);
  }

  recognition.addEventListener('result', onSpeak);

  // Track when recognition stops
  recognition.addEventListener('end', () => {
    isListening = false;

    if (!gameOver) {
      startListening();
    }
  });

  recognition.addEventListener('error', (event) => {
    isListening = false;
    console.log('Speech recognition error:', event.error);
  });

  // Display what the user says
  function writeMessage(msg) {
    msgEl.innerHTML = '';

    const div = document.createElement('div');
    div.textContent = 'You said:';

    const span = document.createElement('span');
    span.classList.add('box');
    span.textContent = msg;

    msgEl.append(div, span);
  }

  // Check msg against the secret number
  function checkNumber(msg) {
    let num = Number(msg);

    // Convert spoken single-digit numbers into numbers
    if (msg === 'one' || msg === 'won') {
      num = 1;
    } else if (msg === 'two') {
      num = 2;
    } else if (msg === 'three') {
      num = 3;
    } else if (msg === 'four') {
      num = 4;
    } else if (msg === 'five') {
      num = 5;
    } else if (msg === 'six') {
      num = 6;
    } else if (msg === 'seven') {
      num = 7;
    } else if (msg === 'eight') {
      num = 8;
    } else if (msg === 'nine') {
      num = 9;
    }

    // Check if the spoken content is a valid number
    if (Number.isNaN(num) || msg === '') {
      showMessage('That is not a valid number');
      return;
    }

    // Check if the number is in range
    if (num < 1 || num > 100) {
      showMessage('Number must be between 1 and 100');
      return;
    }

    // Check the guess against the secret number
    if (num === randomNum) {
      gameOver = true;

      const h2 = document.createElement('h2');
      h2.textContent =
        `Congrats! You have guessed the number! It was ${num}`;

      const button = document.createElement('button');
      button.classList.add('play-again');
      button.id = 'play-again';
      button.textContent = 'Play Again';

      button.addEventListener('click', () => {
        window.location.reload();
      });

      msgEl.append(h2, button);
    } else if (num > randomNum) {
      showMessage('GO LOWER');
    } else {
      showMessage('GO HIGHER');
    }
  }

  // Display feedback
  function showMessage(message) {
    const div = document.createElement('div');
    div.textContent = message;
    msgEl.append(div);
  }

  // Start the game
  startListening();
}
