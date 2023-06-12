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

const table = document.querySelector('table');
const tr1 = table.children[0].children[0].children;
const tr2 = table.children[0].children[1].children;
const tr3 = table.children[0].children[2].children;
const tbody = [tr1, tr2, tr3]
const turnEl = document.querySelector('.turn');
const computer = document.querySelector('#computer');
const winnerEl = document.querySelector('.winner');
const starterEl = document.querySelector('#starter');
const starter = () => parseInt(starterEl.value);

var turn = 0, matrix, wincount = [0, 0];

// listener section -------------------------------------------->

window.onload = start;

computer.onchange = reset;
starterEl.onchange = reset;

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

function main(target, x, y) { // turn handling
    if (target.innerHTML) { return };
    target.innerHTML = `<img src='./assets/${calcTurn()}.svg'/>`;
    matrix[x][y] = calcTurn();
    if (evaluate()) { return };
    turn++;
    turnEl.innerText = `Turn: ${calcTurn()}`;
};

function evaluate() { // evaluating the board :)
    if (check()) {
        stop(`${check()} won!`);
        return true;
    } else if (!matrix.deepIncludes(null)) { // check for draw
        stop('Draw :(');
        return true;
    };
};

function check() { // check if there is a winner
    for (let i = 0; i < 3; i++) { // check rows
        if (matrix[i][0] &&
            matrix[i][0] === matrix[i][1] &&
            matrix[i][1] === matrix[i][2]) {
            return matrix[i][0];
        };
    };
    for (let i = 0; i < 3; i++) { // check columns
        if (matrix[0][i] &&
            matrix[0][i] === matrix[1][i] &&
            matrix[1][i] === matrix[2][i]) {
            return matrix[0][i];
        };
    };
    if (matrix[0][0] &&
        matrix[0][0] === matrix[1][1] &&
        matrix[1][1] === matrix[2][2]) { // check first diagonal
        return matrix[0][0];
    };
    if (matrix[0][2] &&
        matrix[0][2] === matrix[1][1] &&
        matrix[1][1] === matrix[2][0]) { // check second diagonal
        return matrix[0][2];
    };
};

// game handling section --------------------------------------->

function start() {
    matrix = new Array(3).fill().map(() => new Array(3).fill(null));
    if (computer.checked) {
        starterEl[0].innerText = 'You';
        starterEl[1].innerText = 'Computer';
        playComputer();
        return;
    } else {
        starterEl[0].innerText = 'X';
        starterEl[1].innerText = 'O';
    };
    turnEl.innerText = `Turn: ${calcTurn()}`;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = (e) => {
                main(e.target, i, j)
            };
        };
    };
};

function reset() { // reset the game duh
    console.clear();
    winnerEl.style.display = 'none';
    turnEl.style.display = 'block';
    turn = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].innerHTML = '';
        };
    };
    start();
};

function stop(msg) { // stop the click listeners for when game has stopped
    setTimeout(() => {
        turnEl.style.display = 'none';
        winnerEl.children[0].innerText = msg;
        winnerEl.style.display = 'block';
    }, 50);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = null;
        };
    };
};

function calcTurn() {
    if (computer.checked) {
        x = 'Computer';
        o = 'You';
    } else {
        x = 'X';
        o = 'O';
    };
    return parseInt(starterEl.value) ?
        turn % 2 ? o : x :
        turn % 2 ? x : o;
}

// computer section -------------------------------------------->

function playComputer() { // seperate game loop for computer woo
    turnEl.innerText = `Turn: ${calcTurn()}`;
    if (!starter()) {
        computerTurn();
    };
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = (e) => {
                computerMain(e.target, i, j)
            };
        };
    };
};

function computerMain(target, x, y) { // turn handling
    if (target.innerHTML) { return };
    target.innerHTML = `<img src='./assets/X.svg'/>`;
    matrix[x][y] = 'X';
    if (evaluate()) { return };
    turn++;
    turnEl.innerText = `Turn: ${calcTurn()}`;
    computerTurn();
};

function computerTurn() {

    // arrays i need

    let temp = [[], []];
    for (let j = 0, k = 2; j < 3; j++, k--) {
        temp[0].push(matrix[j][k]);
        temp[1].push(matrix[j][j]);
    };

    let temp2 = [[], [], []];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            temp2[i].push(matrix[j][i]);
        };
    };

    // row win opportunities

    for (let i = 0; i < 3; i++) {
        if (matrix[i].includes(null) &&
            matrix[i].join('').match(/O/g)?.length === 2) {
            let j = matrix[i].indexOf(null);
            playComputerMove(i, j);
            console.log('row win opportunity')
            return;
        };
    };

    // column win opportunities

    for (let i = 0; i < 3; i++) {
        if (temp2[i].includes(null) &&
            temp2[i].join('').match(/O/g)?.length === 2) {
            let j = temp2[i].indexOf(null);
            playComputerMove(j, i);
            console.log('column win opportunity')
            return;
        };
    };

    // diagonal win opportunities

    for (let i = 0; i < 2; i++) {
        if (temp[i].includes(null) &&
            temp[i].join('').match(/O/g)?.length === 2) {
            let j = temp[i].indexOf(null);
            if (i) {
                playComputerMove(j, j);
            } else {
                playComputerMove(j, 2 - j);
            };
            console.log('diagonal win opportunity')
            return;
        };
    };

    // row threats

    for (let i = 0; i < 3; i++) {
        if (matrix[i].includes(null) &&
            matrix[i].join('').match(/X/g)?.length === 2) {
            let j = matrix[i].indexOf(null);
            playComputerMove(i, j);
            console.log('row threat')
            return;
        };
    };

    // column threats

    for (let i = 0; i < 3; i++) {
        if (temp2[i].includes(null) &&
            temp2[i].join('').match(/X/g)?.length === 2) {
            let j = temp2[i].indexOf(null)
            playComputerMove(j, i);
            console.log('column threat')
            return;
        };
    };

    // diagonal threats

    for (let i = 0; i < 2; i++) {
        let j = temp[i].indexOf(null);
        if (temp[i].includes(null) &&
            temp[i].join('').match(/X/g)?.length === 2) {
            if (i) {
                playComputerMove(j, j);
            } else {
                playComputerMove(j, 2 - j);
            };
            console.log('diagonal threat')
            return;
        };
    };


    // go middle if it is available

    if (!matrix[1][1]) {
        playComputerMove(1, 1);
        console.log('middle');
        return;
    };

    // block obscure strategy that is based on luck
    // todo: implement in a better way --> done :)

    if (matrix[1][1] &&
        turn === 2 &&
        ([matrix[0][0],
        matrix[0][2],
        matrix[2][0],
        matrix[2][2]].includes('X'))) {
        let i = Math.floor(Math.random() * 3);
        let j = Math.floor(Math.random() * 3);
        while (matrix[i][j] ||
            [matrix[i - 1]?.[j],
            matrix[i + 1]?.[j],
            matrix[i]?.[j - 1],
            matrix[i]?.[j + 1]].includes('X') ||
            (i + j > 0 && i + j < 4 ?
                matrix[j][i] :
                i + j ?
                    matrix[2][2] :
                    matrix[0][0])) {
            i = Math.floor(Math.random() * 3);
            j = Math.floor(Math.random() * 3);
        };
        playComputerMove(i, j);
        console.log('block obscure strategy that is based on luck');
        return;
    };

    // block middle strategy

    if (matrix[1][1] &&
        turn === 1) {
        let i = Math.round(Math.random()) ? 2 : 0;
        let j = Math.round(Math.random()) ? 2 : 0;
        playComputerMove(i, j);
        console.log('block middle strategy');
        return;
    };

    // block other middle strategy

    if (matrix[1][1] === 'X' &&
        turn === 3) {
        let i = Math.round(Math.random()) ? 2 : 0;
        let j = Math.round(Math.random()) ? 2 : 0;
        while (matrix[i][j]) {
            i = Math.round(Math.random()) ? 2 : 0;
            j = Math.round(Math.random()) ? 2 : 0;
        };
        playComputerMove(i, j);
        console.log('block other middle strategy');
        return;
    };

    // block that weird strategy using diagonals

    if (((matrix[0][0] === 'X' &&
        matrix[2][2] === 'X') ||
        (matrix[0][2] === 'X' &&
            matrix[2][0] === 'X')) &&
        turn === 3) {
        let i = Math.floor(Math.random() * 3);
        let j = Math.floor(Math.random() * 3);
        while (i - j != 1 &&
            i - j != -1) {
            i = Math.floor(Math.random() * 3);
            j = Math.floor(Math.random() * 3);
        };
        playComputerMove(i, j);
        console.log('block that weird strategy using diagonals');
        return;
    };

    // random move if nothing is detected

    for (let i = 0; i < 3; i++) {
        let i = Math.floor(Math.random() * 3);
        let j = Math.floor(Math.random() * 3);
        while (matrix[i][j] ||
            (turn === 2 &&
                (matrix[i].filter(x => !x).length === 1 ||
                    temp2[j].filter(x => !x).length === 1))) {
            i = Math.floor(Math.random() * 3);
            j = Math.floor(Math.random() * 3);
        };
        playComputerMove(i, j);
        console.log('random');
        return;
    };
};

function playComputerMove(x, y) {
    matrix[x][y] = 'O';
    tbody[x][y].innerHTML = '<img src=\'./assets/O.svg\'/>';
    turn++;
    evaluate();
};