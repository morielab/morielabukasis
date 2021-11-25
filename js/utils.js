'use strict'

function startTimeInterval() {
    gStartTime = Date.now()
    console.log('gStartTime', gStartTime)
    gGame.gameTimer = setInterval(function () {
        var elTimer = document.querySelector('.timer')
        var miliSecs = Date.now() - gStartTime
        elTimer.innerText = ((miliSecs) / 1000).toFixed(3)
    }, 10)
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


