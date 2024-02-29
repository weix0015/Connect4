// Model
const model = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

// View
const gridContainer = document.querySelector('.grid-container');
const messageElement = document.querySelector('.message');

function initializeGrid() {
  for (let row = 0; row < model.length; row++) {
    for (let col = 0; col < model[row].length; col++) {
      const gridItem = document.createElement('div');
      gridItem.classList.add('grid-item');
      gridItem.dataset.row = row;
      gridItem.dataset.col = col;
      gridItem.addEventListener('click', handleGridItemClick);
      gridContainer.appendChild(gridItem);
    }
  }
}

// Controller
let currentPlayer = 1;
let gameIsOver = false;

function handleGridItemClick(event) {
  if (gameIsOver) return; // Stop if game over

  const clickedCol = parseInt(event.target.dataset.col);

  // lowest available position in the column
  let lowestAvailableRow = -1;
  for (let row = model.length - 1; row >= 0; row--) {
    if (model[row][clickedCol] === 0) {
      lowestAvailableRow = row;
      break;
    }
  }

  // Check if the column is not full
  if (lowestAvailableRow !== -1) {
    // player turn
    playerTurn(lowestAvailableRow, clickedCol, currentPlayer);

    // check for winner after the player turn
    const winner = checkForWinner();
    if (winner === 1) {
      gameIsOver = true;
      messageElement.textContent = "Congratulations! You won!";
      setTimeout(resetGame, 1000);
      return;
    }

    // Check for a tie
    if (isBoardFull()) {
      gameIsOver = true;
      messageElement.textContent = "It's a tie!";
      setTimeout(resetGame, 1000);
      return;
    }

    // Computer turn
    computerTurn();

    // Check for a winner after the Computer turn
    const computerWinner = checkForWinner();
    if (computerWinner) {
      gameIsOver = true;
      setTimeout(resetGame, 500);
    }
  }
}

function playerTurn(row, col, player) {
  model[row][col] = player;
  updateView();
}

function computerTurn() {
  if (gameIsOver) return; // Stop if game over

  // Randomly choose a cell that is not full
  let availableColumns = [];
  for (let col = 0; col < model[0].length; col++) {
    if (model[0][col] === 0) {
      availableColumns.push(col);
    }
  }

  if (availableColumns.length > 0) {
    const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
    for (let row = model.length - 1; row >= 0; row--) {
      if (model[row][randomColumn] === 0) {
        playerTurn(row, randomColumn, 2);
        break;
      }
    }
  }
}

function updateView() {
  // update colors based on model values
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach((item, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;
    const player = model[row][col];
    if (player === 1) {
      item.classList.add('token-player1');
      item.classList.remove('token-player2');
    } else if (player === 2) {
      item.classList.add('token-player2');
      item.classList.remove('token-player1');
    } else {
      item.classList.remove('token-player1', 'token-player2');
    }
  });
}

function checkForWinner() {
  // Check for a winner
  for (let row = 0; row < model.length; row++) {
    for (let col = 0; col < model[row].length; col++) {
      if (model[row][col] !== 0) {
        // Check horizontally
        if (checkAdjacent(row, col, 0, 1) || checkAdjacent(row, col, 0, -1)) {
          return model[row][col];
        }
        // Check vertically
        if (checkAdjacent(row, col, 1, 0)) {
          return model[row][col];
        }
        // Check diagonally (down-right)
        if (checkAdjacent(row, col, 1, 1) || checkAdjacent(row, col, -1, -1)) {
          return model[row][col];
        }
        // Check diagonally (down-left)
        if (checkAdjacent(row, col, 1, -1) || checkAdjacent(row, col, -1, 1)) {
          return model[row][col];
        }
      }
    }
  }
  return 0;
}

function checkAdjacent(row, col, deltaRow, deltaCol) {
  const player = model[row][col];
  let count = 1; // Count the current token
  let newRow = row + deltaRow;
  let newCol = col + deltaCol;
  while (newRow >= 0 && newRow < model.length && newCol >= 0 
    && newCol < model[0].length && model[newRow][newCol] === player) {
    count++;
    newRow += deltaRow;
    newCol += deltaCol;
  }
  return count >= 4;
}


function isBoardFull() {
  for (let row = 0; row < model.length; row++) {
    for (let col = 0; col < model[row].length; col++) {
      if (model[row][col] === 0) {
        return false;
      }
    }
  }
  return true;
}

function resetGame() {
  model.forEach(row => row.fill(0));
  updateView();
  gameIsOver = false;
  messageElement.textContent = "";
}

initializeGrid();