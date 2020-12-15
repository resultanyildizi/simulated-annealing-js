/* NURETTIN RESUL TANYILDIZI */
let size;
let numberOfQueens;
let singleSize;
let myQueens;
let conflict;
let initialConflict;
let initialTemp;
let temperature;
let totalMove;
let coolFactor;

/* Gerekli değişkenlere ilk değer ata */
function setup() {
  size = 500;
  numberOfQueens = 8;
  totalMove = 0;
  initialTemp = 200;
  temperature = 200;
  coolFactor = 0.995;
  singleSize = size / numberOfQueens;
  myQueens = initializeRandomQueens();
  initialConflict = calculateHeuristic(myQueens);
  conflict = calculateHeuristic(myQueens);
  createCanvas(size + 250, size);
}

function draw() {
  frameRate(60);
  background(87, 93, 124);

  drawBoard(myQueens);
  drawUI(conflict, temperature, initialTemp, initialConflict, totalMove);

  /* Belli bir adım sayısını geçinceye ya da hiç conflict kalmayıncaya kadar çalıştır*/
  if (totalMove < 5000 && conflict > 0) {
    simulatedAnnealing();
    coolTemperature(coolFactor);
    conflict = calculateHeuristic(myQueens);
    totalMove++;
  }
}

/* Simulated Annealing fonksiyonu */
function simulatedAnnealing() {
  if (temperature <= 0) return;

  /* Random bir state seç */
  const next = moveAQueen();

  /* Şimdiki state ve komşu state arasındaki conflict farkını hesapla */
  const myH = calculateHeuristic(myQueens);
  const nextH = calculateHeuristic(next);
  const dE = nextH - myH;

  /* Eğer fark sıfırdan küçükse komşu state' e geç */
  if (dE < 0) {
    myQueens = next;
  } else {
    /* Eğer fark sıfıdan büyükse komşu state'e geçmeyi bir ihtimale bağla */
    const probability = Math.exp(-(dE / temperature));
    if (Math.random() * 20 < probability) {
      myQueens = next;
    }
  }
}

/* Random bir vezir seç ve random hareket ettir */
function moveAQueen() {
  const col = Math.floor(Math.random() * myQueens.length);
  const row = Math.floor(Math.random() * myQueens.length);

  let newBoard = [];

  for (let i = 0; i < myQueens.length; i++) {
    newBoard.push(myQueens[i]);
  }

  newBoard[col] = row;
  return newBoard;
}

/* Random bir durum başlat */
function initializeRandomQueens() {
  let a = [];
  for (let i = 0; i < numberOfQueens; i++) {
    const randomRow = Math.floor(Math.random(0, 1) * numberOfQueens);
    a.push(randomRow);
  }

  return a;
}

/* Verilen durumun conflict sayısını hesapla */
function calculateHeuristic(board) {
  let conflict = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      if (board[i] == board[j] || Math.abs(board[i] - board[j]) == j - i)
        conflict++;
    }
  }
  return conflict;
}

function coolTemperature(coolFactor) {
  temperature = Math.max(temperature * coolFactor, 0.00001);
}

/*******************************/
/** Çizimle alakalı işlemler  **/
/*******************************/

function drawBoard() {
  drawGrid();
  for (let i = 0; i < numberOfQueens; i++) {
    drawQueen(
      i * singleSize + singleSize / 2,
      myQueens[i] * singleSize + singleSize / 2
    );
  }
}

function drawGrid() {
  for (let i = 0; i < numberOfQueens; i++) {
    for (let j = 0; j < numberOfQueens; j++) {
      if ((i % 2 == 0 && j % 2 == 0) || (i % 2 == 1 && j % 2 == 1)) {
        fill(255);
      } else {
        fill(0);
      }
      rect(i * singleSize, j * singleSize, singleSize, singleSize);
    }
  }
}

function drawQueen(x, y) {
  push();
  fill(41, 215, 227);
  ellipse(x, y, singleSize - 10);
  pop();
}

function drawUI(
  heuristic,
  temperature,
  initialTemp,
  initialConflict,
  totalMove
) {
  push();
  fill(243, 255, 156);
  textSize(20);
  text("number of queens: " + numberOfQueens, size + 10, 30);
  text("initial conflict: " + initialConflict, size + 10, 60);
  text(("temp: " + initialTemp).substring(0, 15), size + 10, 90);
  fill(243, 129, 156);
  text("conflict: " + heuristic, size + 10, 120);
  text(("temp: " + temperature).substring(0, 15), size + 10, 150);
  fill(255);
  text("moves: " + totalMove, size + 10, 180);
  text("Nurettin Resul Tanyıldızı", size + 10, height - 10);
  pop();
}
