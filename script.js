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

var turn = 0, ncMatrix, wincount = [0, 0];

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
};

// normal play section ----------------------------------------->

function ncMain(target, x, y) { // turn handling
    if (target.innerText) { return };
    target.innerText = turn % 2 ? 'O' : 'X';
    ncMatrix[x][y] = target.innerText;
    if (ncEvaluate()) { return };
    turn++;
    turnEl.innerText = `Turn:\n${turn % 2 ? 'O' : 'X'}`;
};

function ncEvaluate() { // evaluating the board :)
    if (ncCheck()) {
        ncStop(`${ncCheck()} won!`);
        return true;
    } else if (!ncMatrix.deepIncludes(null)) { // check for draw
        ncStop('Draw :(');
        return true;
    };
};

function ncCheck() { // check if there is a winner
    for (let i = 0; i < 3; i++) { // check rows
        if (ncMatrix[i][0] &&
            ncMatrix[i][0] === ncMatrix[i][1] &&
            ncMatrix[i][1] === ncMatrix[i][2]) {
            return ncMatrix[i][0];
        };
    };
    for (let i = 0; i < 3; i++) { // check columns
        if (ncMatrix[0][i] &&
            ncMatrix[0][i] === ncMatrix[1][i] &&
            ncMatrix[1][i] === ncMatrix[2][i]) {
            return ncMatrix[0][i];
        };
    };
    if (ncMatrix[0][0] &&
        ncMatrix[0][0] === ncMatrix[1][1] &&
        ncMatrix[1][1] === ncMatrix[2][2]) { // check first diagonal
        return ncMatrix[0][0];
    };
    if (ncMatrix[0][2] &&
        ncMatrix[0][2] === ncMatrix[1][1] &&
        ncMatrix[1][1] === ncMatrix[2][0]) { // check second diagonal
        return ncMatrix[0][2];
    };
};

// game handling section --------------------------------------->

function ncStart() {
    ncMatrix = new Array(3).fill().map(() => new Array(3).fill(null));
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
        turnEl.innerText = 'Turn:\nN/A';
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
    ncMatrix[x][y] = target.innerText;
    if (ncEvaluate()) { return };
    turn++;
    turnEl.innerText = `Turn:\n${turn % 2 ? 'You' : 'Computer'}`;
    ncComputerTurn();
};

function ncComputerTurn() {

    // column win opportunities

    for (let i = 0; i < 3; i++) {
        let j = ncMatrix[i].indexOf(null);

        if (ncMatrix[i].includes(null) &&
            ncMatrix[i].join('').match(/O/g) ?
            ncMatrix[i].join('').match(/O/g).length === 2 :
            false) {
            ncMatrix[i][j] = 'O';
            tbody[i][j].innerText = 'O';
            turn++;
            ncEvaluate();
            return;
        };
    };

    // row win opportunities

    for (let i = 0; i < 3; i++) {
        let temp = [];
        for (let j = 0; j < 3; j++) {
            temp.push(ncMatrix[j][i]);
        };
        let j = temp.indexOf(null);

        if (temp.includes(null) &&
            temp.join('').match(/X/g) ?
            temp.join('').match(/X/g).length === 2 :
            false) {
            ncMatrix[j][i] = 'O';
            tbody[j][i].innerText = 'O';
            turn++;
            ncEvaluate();
            return;
        };
    };

    // diagonal win opportunities

    let temp = [[], []];
    for (let j = 0, k = 2; j < 3; j++, k--) {
        temp[0].push(ncMatrix[j][k]);
        temp[1].push(ncMatrix[j][j]);
    };

    for (let i = 0; i < 2; i++) {
        let j = temp[i].indexOf(null);
        if (temp[i].includes(null) &&
            temp[i].join('').match(/O/g) ?
            temp[i].join('').match(/O/g).length === 2 :
            false) {
            if (!i) {
                ncMatrix[j][j] = 'O';
                tbody[j][j].innerText = 'O';
            } else {
                ncMatrix[j][2 - j] = 'O';
                tbody[j][2 - j] = 'O';
            };
            turn++;
            ncEvaluate();
            return;
        };
    };

    // column threats

    for (let i = 0; i < 3; i++) {
        let j = ncMatrix[i].indexOf(null);

        if (ncMatrix[i].includes(null) &&
            ncMatrix[i].join('').match(/X/g) ?
            ncMatrix[i].join('').match(/X/g).length === 2 :
            false) {
            ncMatrix[i][j] = 'O';
            tbody[i][j].innerText = 'O';
            turn++;
            ncEvaluate();
            return;
        };
    };

    // row threats

    for (let i = 0; i < 3; i++) {
        let temp = [];
        for (let j = 0; j < 3; j++) {
            temp.push(ncMatrix[j][i]);
        };
        let j = temp.indexOf(null)

        if (temp.includes(null) &&
            temp.join('').match(/O/g) ?
            temp.join('').match(/O/g).length === 2 :
            false) {
            console.log(j, i);
            ncMatrix[j][i] = 'O';
            tbody[j][i].innerText = 'O';
            turn++;
            ncEvaluate();
            return;
        };
    };

    // diagonal threats

    let temp2 = [[], []];
    for (let j = 0, k = 2; j < 3; j++, k--) {
        temp2[0].push(ncMatrix[j][k]);
        temp2[1].push(ncMatrix[j][j]);
    };

    for (let i = 0; i < 2; i++) {
        let j = temp2[i].indexOf(null);
        if (temp2[i].includes(null) &&
            temp2[i].join('').match(/X/g) ?
            temp2[i].join('').match(/X/g).length === 2 :
            false) {
            if (i) {
                ncMatrix[j][j] = 'O';
                tbody[j][j].innerText = 'O';
            } else {
                ncMatrix[j][2 - j] = 'O';
                tbody[j][2 - j].innerText = 'O';
            };
            turn++;
            ncEvaluate();
            return;
        };
    };

    // random move if nothing is detected

    let i = Math.floor(Math.random() * 3);
    while (!ncMatrix[i].includes(null)) {
        i = Math.floor(Math.random() * 3);
    };
    let j = Math.floor(Math.random() * 3);
    while (ncMatrix[i][j]) {
        j = Math.floor(Math.random() * 3);
    };
    ncMatrix[i][j] = 'O';
    tbody[i][j].innerText = 'O';
    turn++;
    ncEvaluate();
    return;
};