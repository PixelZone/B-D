const imageCount = 20;
const query = new URLSearchParams(window.location.search);
const mode = query.get("mode");
const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let startTime;
let timerInterval;

function getImagePaths(mode) {
  let paths = [];
  const dominik = [...Array(imageCount).keys()].map(i => `images/dominik${i + 1}.jpg`);
  const beata = [...Array(imageCount).keys()].map(i => `images/beata${i + 1}.jpg`);

  if (mode === "dominik") {
    paths = dominik;
  } else if (mode === "beata") {
    paths = beata;
  } else if (mode === "vegyes") {
    const combined = [...dominik, ...beata];
    while (paths.length < imageCount) {
      const rand = combined.splice(Math.floor(Math.random() * combined.length), 1)[0];
      paths.push(rand);
    }
  }

  return paths.flatMap(p => [p, p]); // 2x minden kép
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createCard(imageSrc) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"><img src="${imageSrc}" /></div>
      <div class="card-back"><img src="images/back.jpg" /></div>
    </div>
  `;
  card.addEventListener("click", () => flipCard(card));
  return card;
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  const img1 = firstCard.querySelector(".card-front img").src;
  const img2 = secondCard.querySelector(".card-front img").src;

  if (img1 === img2) {
    setTimeout(() => {
      firstCard.style.visibility = "hidden";
      secondCard.style.visibility = "hidden";
      matchedPairs++;
      if (matchedPairs === imageCount) {
        endGame();
      }
      resetBoard();
    }, 500);
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timerDisplay.textContent = `Idő: ${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  setTimeout(() => {
    alert(`Gratulálok, megtaláltad az összeset.\nEnnyi idő alatt: ${minutes} perc ${seconds} másodperc.`);
    window.location.href = "index.html";
  }, 300);
}

function init() {
  const images = shuffle(getImagePaths(mode));
  images.forEach(img => {
    gameBoard.appendChild(createCard(img));
  });
  startTimer();
}

init();
