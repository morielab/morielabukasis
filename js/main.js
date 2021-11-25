'use strict'


const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';
const LIFE = '🧡';
const MAXLIVES = 3;

var gBoard;
var gStartTime;
var gMines = [];

var gCell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
};

var gGame = {
    isGameOver: false,
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true,
    gameTimer: 0,
    lives: 3
};

var gLevel = {
    SIZE: 4,
    MINES: 2
};

// ------------------------functions-------------------------------------//

function initGame() {
    gBoard = buildBoard();
    renderBoard();
    if (gGame.lives === 0) {
        gGame.lives = MAXLIVES;
        var elRestartBtn = document.querySelector('.restart-btn');
        elRestartBtn.innerText = '😀';
    }
    gGame.markedCount = getMaxMinesNumber();
    numLives();
    clearInterval(gGame.gameTimer);
    gGame.gameTimer = 0;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = '0:000';
    var elFlags = document.querySelector('.flags')
    elFlags.innerText = gGame.markedCount;
    gGame.isFirstClick = true;
    gGame.isGameOver = false;
};


function buildBoard() {
    var level = getGameLevel();
    var board = [];
    for (var i = 0; i < level; i++) {
        board[i] = [];
        for (var j = 0; j < level; j++) {
            board[i][j] = {
                minesAroundCount: 4,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    // console.table('board:', board);
    return board;
}


// Render the board as a <table> to the page
function renderBoard() {
    var currentCount = 0;
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            strHTML += `<td onmousedown="cellClicked(event,this,${i},${j})" data-i="${i}" data-j="${j}" id="${currentCount++}"></td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount(board, cellI, cellJ) {
    var minesNegsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine) minesNegsCount++;
        }
    }
    // console.log(minesNegsCount);
    return minesNegsCount;
};


function getGameLevel() {
    //check which level selected
    if (document.getElementById('levelEasy').checked) {
        return 4;
    }
    if (document.getElementById('levelMedium').checked) {
        return 8;
    }
    if (document.getElementById('levelHard').checked) {
        return 12;
    }
}


function createMines(num, currentI, currentJ) {
    var createdMines = 0;
    var mines = [];
    var isMineFound = false;
    while (createdMines < num) {
        isMineFound = false;
        var cellI = getRandomInt(0, gBoard.length);
        var cellJ = getRandomInt(0, gBoard[0].length);
        if (cellI === currentI && cellJ === currentJ) continue;
        for (var i = 0; i < mines.length; i++) {
            var mine = mines[i];
            if (mine.i === cellI && mine.j === cellJ) {
                isMineFound = true;
                break;
            }
        }
        if (isMineFound) continue;
        mines.push({ i: cellI, j: cellJ });
        gBoard[cellI][cellJ].isMine = true;
        createdMines++;
    }
}


//render mines
function renderMines(cellI, cellJ) {
    var currentCount = -1;
    var elRestartBtn = document.querySelector('.restart-btn');
    gGame.lives--;
    gGame.lives === 0 ? elRestartBtn.innerText = '😵' : elRestartBtn.innerText = '😀';
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j];
            currentCount++;
            if (!currCell.isMine) continue;
            var cell = document.getElementById(currentCount);
            if (cellI === i && cellJ === j) {
                // draw red mine
                cell.innerText = MINE;
                cell.style.backgroundColor = 'red';
            }
            else {
                cell.innerText = MINE;
            }
        }
    }
    gGame.isGameOver = true;
    clearInterval(gGame.gameTimer);
    gGame.gameTimer = 0;
    numLives();
}


function setFlag(gBoard, i, j) {
    var cell = document.getElementById((gBoard.length * i) + j);
    cell.innerText = FLAG;
}


function getMaxMinesNumber() {
    switch (gBoard.length) {
        case 4:
            return 2;
            break;
        case 8:
            return 12;
            break;
        case 12:
            return 30;
            break;
    }
}


// Called when a cell (td) is clicked
function cellClicked(event, elCell, i, j) {
    event.preventDefault();
    if (gGame.isGameOver) return;
    var clickedCell = gBoard[i][j];
    if (gGame.isFirstClick) {
        createMines(getMaxMinesNumber(), i, j);
        gGame.isFirstClick = false;
        startTimeInterval();
    }
    //check if isMine
    if (clickedCell.isMine && event.button !== 2) {
        //draw mine
        renderMines(i, j)
    }
    else if (!gGame.isGameOver) {
        //check if previously was clicked
        if (clickedCell.isShown) return;
        if (clickedCell.isMarked) {
            elCell.innerText = '';
            clickedCell.isMarked = false;
            gGame.markedCount++;
            var elFlags = document.querySelector('.flags')
            elFlags.innerText = gGame.markedCount;
            return;
        }
        if (event.button === 0) {
            clickedCell.isShown = true;
        }
        else {
            if (gGame.markedCount > 0) {
                clickedCell.isMarked = true;
                gGame.markedCount--;
                var elFlags = document.querySelector('.flags')
                elFlags.innerText = gGame.markedCount;
            }
            else
                return;
        }
        elCell.style.backgroundColor = '#7d7d81';
        if (clickedCell.isShown) {
            var neighbors = setMinesNegsCount(gBoard, i, j);
            elCell.innerHTML = neighbors;
            //recursion
            if (neighbors === 0) {
                elCell.innerText = '';
                //check up
                if (i > 0) {
                    var uCell = document.getElementById(gBoard.length * (i - 1) + j);
                    if (!gBoard[i - 1][j].isShown && !gBoard[i - 1][j].isMarked) {
                        cellClicked(event, uCell, i - 1, j);
                    }
                }
                //check down
                if (i < gBoard.length - 1) {
                    var uCell = document.getElementById(gBoard.length * (i + 1) + j);
                    if (!gBoard[i + 1][j].isShown && !gBoard[i + 1][j].isMarked) {
                        cellClicked(event, uCell, i + 1, j);
                    }
                }
                //check right
                if (j < gBoard.length - 1) {
                    var uCell = document.getElementById(gBoard.length * i + (j + 1));
                    if (!gBoard[i][j + 1].isShown && !gBoard[i][j + 1].isMarked) {
                        cellClicked(event, uCell, i, j + 1);
                    }
                }
                //check left
                if (j > 0) {
                    var uCell = document.getElementById(gBoard.length * i + (j - 1));
                    if (!gBoard[i][j - 1].isShown && !gBoard[i][j - 1].isMarked) {
                        cellClicked(event, uCell, i, j - 1);
                    }
                }
            }
        }
        if (clickedCell.isMarked) elCell.innerText = FLAG;
        checkGameOver();
    }
};


function numLives() {
    var elLives = document.querySelector('.lives')
    var strHTML = '';
    for (var i = 0; i < gGame.lives; i++) {
        strHTML += ` ${LIFE}`;
    }
    elLives.innerHTML = strHTML;
}


//Game ends when all mines are marked, 
// and all the other cells are shown
function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isShown && !cell.isMarked) return;
        }
    }
    gGame.isGameOver = true;
    clearInterval(gGame.gameTimer);
    var elRestartBtn = document.querySelector('.restart-btn');
    elRestartBtn.innerText = '😎';
    gGame.gameTimer = 0;
};


function restart() {
    initGame()
}

