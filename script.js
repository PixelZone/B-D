const startBtn = document.getElementById('startBtn');
const gameMenu = document.getElementById('gameMenu');
const gameBoard = document.getElementById('gameBoard');
const cardContainer = document.getElementById('cardContainer');
const gameOver = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const timerDisplay = document.getElementById('timer');
const finalTimeDisplay = document.getElementById('finalTime');

let cards = [];
let flippedCards = [];
let gameMode = '';
let timer;
let seconds = 0;
let minutes = 0;

const images = {
  Beáta: [
    'images/beata1.jpg','images/beata2.jpg','images/beata3.jpg','images/beata4.jpg','images/beata5.jpg',
    'images/beata6.jpg','images/beata7.jpg','images/beata8.jpg','images/beata9.jpg','images/beata10.jpg',
    'images/beata11.jpg','images/beata12.jpg','images/beata13.jpg','images/beata14.jpg','images/beata15.jpg',
    'images/beata16.jpg','images/beata17.jpg','images/beata18.jpg','images/beata19.jpg','images/beata20.jpg'
  ],
  Dominik: [
    'images/dominik1.jpg','images/dominik2.jpg','images/dominik3.jpg','images/dominik4.jpg','images/dominik5.jpg',
    'images/dominik6.jpg','images/dominik7.jpg','images/dominik8.jpg','images/dominik9.jpg','images/dominik10.jpg',
    'images/dominik11.jpg','images/dominik12.jpg','images/dominik13.jpg','images/dominik14.jpg','images/dominik15.jpg',
    'images/dominik16.jpg','images/dominik17.jpg','images/dominik18.jpg','images/dominik19.jpg','images/dominik20.jpg'
  ],
  Vegyes: [
    'images/beata1.jpg','images/beata2.jpg','images/beata3.jpg','images/beata4.jpg','images/beata5.jpg',
    'images/beata6.jpg','images/beata7.jpg','images/beata8.jpg','images/beata9.jpg','images/beata10.jpg',
    'images/beata11.jpg','images/beata12.jpg','images/beata13.jpg','images/beata14.jpg','images/beata15.jpg',
    'images/beata16.jpg','images/beata17.jpg','images/beata18.jpg','images/beata19.jpg','images/beata20.jpg',
    'images/dominik1.jpg','images/dominik2.jpg','images/dominik3.jpg','images/dominik4.jpg','images/dominik5.jpg',
    'images/dominik6.jpg','images/dominik7.jpg','images/dominik8.jpg','images/dominik9.jpg','images/dominik10.jpg',
    'images/dominik11.jpg','images/dominik12.jpg','images/dominik13.jpg','images/dominik14.jpg','images/dominik15.jpg',
    'images/dominik16.jpg','images/dominik17.jpg','images/dominik18.jpg','images/dominik19.jpg','images/dominik20.jpg'
  ]
};

startBtn.addEventListener('click', () => {
  gameMenu.classList.remove('hidden');
  startBtn.classList.add('hidden');
});

document.querySelectorAll('.gameMode').forEach(button => {
  button.addEventListener('click', (e) => {
    gameMode = e.target.getAttribute('data-mode');
    startGame(gameMode);
  });
});

function startGame(mode) {
  gameMenu.classList.add('hidden');
  gameBoard.classList.remove('hidden');
  resetGame();

  if (mode === 'Vegyes') {
    const selected = getRandomCards(images.Vegyes);
    cards = [...selected, ...selected];
  } else {
    cards = [...images[mode], ...images[mode]];
  }

  shuffle(cards);
  renderCards();
  startTimer();
}

function getRandomCards(allCards) {
  const selected = [];
  while (selected.length < 20) {
    const rand = allCards[Math.floor(Math.random() * allCards.length)];
    if (!selected.includes(rand)) selected.push(rand);
  }
  return selected;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderCards() {
  cardContainer.innerHTML = '';
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('data-index', index);

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');
    front.style.backgroundImage = `url(${card})`;

    const back = document.createElement('div');
    back.classList.add('card-back');

    inner.appendChild(front);
    inner.appendChild(back);
    cardElement.appendChild(inner);

    cardElement.addEventListener('click', flipCard);
    cardContainer.appendChild(cardElement);
  });
}

function flipCard(e) {
  const card = e.currentTarget;
  if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
    const index = card.getAttribute('data-index');
    card.classList.add('flipped');
    flippedCards.push({ index, element: card });

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (cards[first.index] === cards[second.index]) {
    flippedCards = [];
    checkWin();
  } else {
    setTimeout(() => {
      first.element.classList.remove('flipped');
      second.element.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function checkWin() {
  const total = document.querySelectorAll('.card').length;
  const flipped = document.querySelectorAll('.card.flipped').length;

  if (flipped === total) {
    stopTimer();
    gameOver.classList.remove('hidden');
    finalTimeDisplay.textContent = `${minutes} perc, ${seconds} másodperc`;
  }
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    timerDisplay.textContent = `${minutes} perc, ${seconds} másodperc`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function resetGame() {
  flippedCards = [];
  minutes = 0;
  seconds = 0;
  timerDisplay.textContent = '0 perc, 0 másodperc';
  gameOver.classList.add('hidden');
}

restartBtn.addEventListener('click', () => {
  gameOver.classList.add('hidden');
  startGame(gameMode);
});
