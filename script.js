const table = document.querySelector('.nc-table');
const tr1 = table.children[0].children[0].children;
const tr2 = table.children[0].children[1].children;
const tr3 = table.children[0].children[2].children;
const tbody = [tr1, tr2, tr3]
const turnEl = document.querySelector('.nc-turn');

var turn = 0, gameMatrix;

document.onload = init();

Array.prototype.deepIncludes = function(x) { // because Array.prototype.includes doesnt work for 2d arrays
    for (let i = 0; i < this.length; i++) {
        if (this[i].includes(x)) {
            return true;
        };
    };
    return false;
}

function init() {
    turnEl.innerText = `Turn: ${turn % 2 ? 'O' : 'X'}`;
    gameMatrix = new Array(3).fill().map(() => new Array(3).fill(null));
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].onclick = (e) => {
                ncMain(e.target, i, j)
            };
        };
    };
};

function ncMain(target, x, y) { //
    if (target.innerText) { return };
    target.innerText = turn % 2 ? 'O' : 'X';
    gameMatrix[x][y] = target.innerText;
    evalWin = evaluate();
    if (evalWin) { setTimeout(() => { alert(evalWin); resetGame() }, 50) };
    turn++;
    turnEl.innerText = `Turn: ${turn % 2 ? 'O' : 'X'}`;
};

function evaluate() { // i dont think i need this
    console.table(gameMatrix);
    if (check('X')) {
        return 'X Won!';
    } else if (check('O')) {
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
        setTimeout(() => {alert('Draw :('); resetGame() }, 50);
    };
};

function resetGame() { // reset the game duh
    turn = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            tbody[i][j].innerText = '';
            tbody[i][j].onclick = null;
        };
    };
    init();
};