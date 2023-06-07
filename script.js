/*
 * made By reuben schofield :)
 * 
 * naughts and crosses game with HTML/CSS/JS
 * 
 * the computer is just random moves, im not sure where to start with a proper computer to play against
 * 
 * also I used setTimeout() in evaluating because I want the last move to load properly
 
 */

// variable section -------------------------------------------->

const table = document.querySelector('.nc-table');
const tr1 = table.children[0].children[0].children;
const tr2 = table.children[0].children[1].children;
const tr3 = table.children[0].children[2].children;
const tbody = [tr1, tr2, tr3]
const turnEl = document.querySelector('.nc-turn');
const computer = document.querySelector('#nc-computer');
const winnerEl = document.querySelector('.nc-winner');

var turn = 0, gameMatrix, wincount = [0, 0];

// listener section -------------------------------------------->

document.onload = ncStart();

computer.onchange = () => {
    ncReset();
    if (computer.checked) {
        ncPlayComputer();
    };
};

// that one function that i need that one time section --------->

Array.prototype.deepIncludes = function (x) { // because Array.prototype.includes() doesnt work for 2d arrays
    for (let i = 0; i < this.length; i++) {
        if (this[i].includes(x)) {
            return true;
        };
    };
    return false;
}

// normal play section ----------------------------------------->

function ncMain(target, x, y) { // turn handling
    if (target.innerText) { return };
    target.innerText = turn % 2 ? 'O' : 'X';
    gameMatrix[x][y] = target.innerText;
    ncEvaluate();
    turn++;
    turnEl.innerText = `Turn:\n${turn % 2 ? 'O' : 'X'}`;
};

function ncEvaluate() { // evaluating the board :)
    if (ncCheck()) {
        ncStop(`${ncCheck()} won!`);
    } else if (!gameMatrix.deepIncludes(null)) { // check for draw
        ncStop('Draw :(');
    };
};

function ncCheck() { // check if there is a winner
    for (let i = 0; i < 3; i++) { // check rows
        if (gameMatrix[i][0] &&
            gameMatrix[i][0] === gameMatrix[i][1] &&
            gameMatrix[i][1] === gameMatrix[i][2]) {
            return gameMatrix[i][0];
        };
    };
    for (let i = 0; i < 3; i++) { // check columns
        if (gameMatrix[0][i] &&
            gameMatrix[0][i] === gameMatrix[1][i] &&
            gameMatrix[1][i] === gameMatrix[2][i]) {
            return gameMatrix[0][i];
        };
    };
    if (gameMatrix[0][0] &&
        gameMatrix[0][0] === gameMatrix[1][1] &&
        gameMatrix[1][1] === gameMatrix[2][2]) { // check first diagonal
        return gameMatrix[0][0];
    };
    if (gameMatrix[0][2] &&
        gameMatrix[0][2] === gameMatrix[1][1] &&
        gameMatrix[1][1] === gameMatrix[2][0]) { // check second diagonal
        return gameMatrix[0][2];
    };
};

// game handling section --------------------------------------->

function ncStart() {
    gameMatrix = new Array(3).fill().map(() => new Array(3).fill(null));
    if (computer.checked) {
        ncPlayComputer();
        return;
    };
    turnEl.innerText = `Turn:\n${turn % 2 ? 'O' : 'X'}`;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = (e) => {
                ncMain(e.target, i, j)
            };
        };
    };
};

function ncReset() { // reset the game duh
    winnerEl.style.visibility = 'hidden';
    turn = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].innerText = '';
        };
    };
    ncStart();
};

function ncStop(msg) { // stop the click listeners for when game has stopped
    setTimeout(() => {
        winnerEl.children[0].innerText = msg;
        winnerEl.style.visibility = 'visible';
    }, 50);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = null;
        };
    };
};

// computer section -------------------------------------------->

function ncPlayComputer() { // seperate game loop for computer woo
    turnEl.innerText = `Turn:\n${turn % 2 ? 'Computer' : 'You'}`;
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
    ncEvaluate();
    turn++;
    turnEl.innerText = `Turn:\n${turn % 2 ? 'You' : 'Computer'}`;
    ncComputerTurn();
};

function ncComputerTurn() {
    let i = Math.floor(Math.random() * 3);
    while (!gameMatrix[i].includes(null)) {
        i = Math.floor(Math.random() * 3);
    };
    let j = Math.floor(Math.random() * 3);
    while (gameMatrix[i][j]) {
        j = Math.floor(Math.random() * 3);
    };
    gameMatrix[i][j] = 'O';
    tbody[i][j].innerText = 'O';
    ncEvaluate();
    turn++;
}