let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let singlePlayer = false;
let movesLeft = 9;
let xScore = 0;
let oScore = 0;
let matchCounter = 0;

function startGame(mode) {
    singlePlayer = mode === 'single';
    gameActive = true;

    if (matchCounter === 3) {
        xScore = 0;
        oScore = 0;
        matchCounter = 0;
        document.getElementById('reset-bar').classList.add('hidden');
        document.getElementById('score-container').classList.remove('hidden');
        document.getElementById('home-container').classList.remove('hidden');
        document.getElementById('game-container').classList.add('hidden');
        document.querySelector('.options').classList.remove('hidden');
    } else {
        document.querySelector('.options').classList.add('hidden');
        document.getElementById('home-container').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('score-container').classList.remove('hidden');
        document.getElementById('reset-bar').classList.remove('hidden');
        document.getElementById('status-message').textContent = `Player ${currentPlayer}'s turn`;
        document.getElementById('x-score').textContent = `X: ${xScore}`;
        document.getElementById('o-score').textContent = `O: ${oScore}`;
        document.getElementById('matches').textContent = `Match: ${matchCounter + 1}`;
        displayBoard();
    }
}

function displayBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.textContent = board[i];
        boardElement.appendChild(cell);
    }
}

function cellClick(event) {
    if (!gameActive) return;

    const clickedCellIndex = event.target.dataset.index;

    if (board[clickedCellIndex] === '') {
        board[clickedCellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;

        movesLeft--;

        if (checkWin()) {
            endGame(`${currentPlayer} wins!`);
        } else if (movesLeft === 0) {
            endGame('It\'s a draw!');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('status-message').textContent = `Player ${currentPlayer}'s turn`;

            if (singlePlayer && currentPlayer === 'O') {
                computerMove();
            }
        }
    }
}

function computerMove() {
    const emptyCells = board.reduce((acc, cell, index) => (cell === '' ? acc.concat(index) : acc), []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerMoveIndex = emptyCells[randomIndex];

    setTimeout(() => {
        board[computerMoveIndex] = currentPlayer;
        document.querySelector(`[data-index="${computerMoveIndex}"]`).textContent = currentPlayer;
        movesLeft--;

        if (checkWin()) {
            endGame(`${currentPlayer} wins!`);
        } else if (movesLeft === 0) {
            endGame('It\'s a draw!');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('status-message').textContent = `Player ${currentPlayer}'s turn`;
        }
    }, 500);
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
            updateScore();
            return true;
        }
    }

    return false;
}

function updateScore() {
    if (currentPlayer === 'X') {
        xScore++;
    } else {
        oScore++;
    }

    matchCounter++;

    if (matchCounter === 3) {
        endGame('Game Over');
    } else {
        document.getElementById('x-score').textContent = `X: ${xScore}`;
        document.getElementById('o-score').textContent = `O: ${oScore}`;
        document.getElementById('matches').textContent = `Match: ${matchCounter + 1}`;
        resetBoard();
    }
}

function endGame(message) {
    gameActive = false;
    document.getElementById('status-message').textContent = message;
    document.getElementById('reset-bar').classList.remove('hidden');
    document.getElementById('score-container').classList.add('hidden');

    if (matchCounter === 3) {
        declareWinner();
    }
}

function declareWinner() {
    let winner = '';
    if (xScore > oScore) {
        winner = 'X wins!';
    } else if (xScore < oScore) {
        winner = 'O wins!';
    } else {
        winner = 'It\'s a draw!';
    }

    document.getElementById('status-message').textContent = `Game Over. ${winner}`;
    document.querySelector('.options').classList.remove('hidden');
}

function resetGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    movesLeft = 9;

    document.getElementById('status-message').textContent = `Player ${currentPlayer}'s turn`;
    displayBoard();

    if (matchCounter === 3) {
        xScore = 0;
        oScore = 0;
        matchCounter = 0;
        document.getElementById('x-score').textContent = 'X: 0';
        document.getElementById('o-score').textContent = 'O: 0';
        document.getElementById('matches').textContent = 'Match: 0';
    }
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    movesLeft = 9;
    document.getElementById('status-message').textContent = `Player X's turn`;
    displayBoard();

    if (matchCounter < 3) {
        setTimeout(() => {
            resetGame();
        }, 2000);
    }
}

function goToHome() {
    document.getElementById('reset-bar').classList.add('hidden');
    document.getElementById('score-container').classList.remove('hidden');
    document.querySelector('.options').classList.remove('hidden');
    resetGame();
    document.getElementById('home-container').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
}
