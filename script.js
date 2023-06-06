/*
 * Made By Reuben Schofield :)
 * 
 * Naughts and Crosses game with HTML/CSS/JS
 * 
 * The Computer is just random moves, I'm not sure where to start with a proper computer to play against
 * 
 */

const table = document.querySelector('.nc-table');
const tr1 = table.children[0].children[0].children;
const tr2 = table.children[0].children[1].children;
const tr3 = table.children[0].children[2].children;
const tbody = [tr1, tr2, tr3]
const turnEl = document.querySelector('.nc-turn');
const computer = document.querySelector('#nc-computer');
const winnerEl = document.querySelector('.nc-winner');

var turn = 0, gameMatrix, wincount = [0, 0];

document.onload = init();

computer.addEventListener('change', () => {
    if (computer.checked) {
        playComputer();
    };
});

Array.prototype.deepIncludes = function (x) { // because Array.prototype.includes() doesnt work for 2d arrays
    for (let i = 0; i < this.length; i++) {
        if (this[i].includes(x)) {
            return true;
        };
    };
    return false;
}

function init() {
    gameMatrix = new Array(3).fill().map(() => new Array(3).fill(null));
    if (computer.checked) {
        playComputer();
        return;
    };
    turnEl.innerText = `Turn: ${turn % 2 ? 'O' : 'X'}`;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = (e) => {
                ncMain(e.target, i, j)
            };
        };
    };
};

function ncMain(target, x, y) { // turn handling
    if (target.innerText) { return };
    target.innerText = turn % 2 ? 'O' : 'X';
    gameMatrix[x][y] = target.innerText;
    evalWin = evaluate();
    if (evalWin) {
        setTimeout(() => {
            winnerEl.children[0].innerText = evalWin;
            winnerEl.style.visibility = 'visible';
        }, 50);
    };
    turn++;
    turnEl.innerText = `Turn: ${turn % 2 ? 'O' : 'X'}`;
};

function evaluate() { // i dont think i need this
    if (check('X')) {
        stopListeners();
        return 'X Won!';
    } else if (check('O')) {
        stopListeners();
        return 'O Won!';
    };
};

function check(symbol) { // check if there is a winner
    for (let i = 0; i < 3; i++) { // check rows
        if (gameMatrix[i][0] === symbol &&
            gameMatrix[i][0] === gameMatrix[i][1] &&
            gameMatrix[i][1] === gameMatrix[i][2]) {
            return true;
        };
    };
    for (let i = 0; i < 3; i++) { // check columns
        if (gameMatrix[0][i] === symbol &&
            gameMatrix[0][i] === gameMatrix[1][i] &&
            gameMatrix[1][i] === gameMatrix[2][i]) {
            return true;
        };
    };
    if (gameMatrix[0][0] === symbol &&
        gameMatrix[0][0] === gameMatrix[1][1] &&
        gameMatrix[1][1] === gameMatrix[2][2]) { // check first diagonal
        return true;
    };
    if (gameMatrix[0][2] === symbol &&
        gameMatrix[0][2] === gameMatrix[1][1] &&
        gameMatrix[1][1] === gameMatrix[2][0]) { // check second diagonal
        return true;
    };
    if (!gameMatrix.deepIncludes(null)) { // check for a draw
        setTimeout(() => {
            winnerEl.children[0].innerText = 'Draw :(';
            winnerEl.style.visibility = 'visible';
        }, 50);
    };
};

function resetGame() { // reset the game duh
    winnerEl.style.visibility = 'hidden';
    turn = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].innerText = '';
        };
    };
    init();
};

function stopListeners() { // stop the click listeners for when game has stopped
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = null;
        };
    };
};

// Computer section!!!!!

function playComputer() { // seperate game loop for computer woo
    turnEl.innerText = `Turn: ${turn % 2 ? 'Computer' : 'You'}`;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = (e) => {
                ncMainButComputer(e.target, i, j)
            };
        };
    };
};

function ncMainButComputer(target, x, y) { // turn handling
    if (target.innerText) { return };
    target.innerText = 'X';
    gameMatrix[x][y] = target.innerText;
    evalWin = evaluate();
    if (evalWin) {
        setTimeout(() => {
            winnerEl.children[0].innerText = evalWin;
            winnerEl.style.visibility = 'visible';
        }, 50);
        return;
    };
    turn++;
    turnEl.innerText = `Turn: ${turn % 2 ? 'You' : 'Computer'}`;
    computerTurn();
};

function computerTurn() {
    let i = Math.floor(Math.random() * 3);
    while (!gameMatrix[i].includes(null)) {
        i = Math.floor(Math.random() * 3);
    };
    let j = Math.floor(Math.random() * 3);
    while (gameMatrix[i][j] != null) {
        j = Math.floor(Math.random() * 3);
    };
    gameMatrix[i][j] = 'O';
    tbody[i][j].innerText = 'O';
    evalWin = evaluate();
    if (evalWin) {
        setTimeout(() => {
            winnerEl.children[0].innerText = evalWin;
            winnerEl.style.visibility = 'visible';
        }, 50);
    };
    turn++;
}