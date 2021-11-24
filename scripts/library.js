'use strict';

document.addEventListener('keydown', keyDownHandler, false);

function keyDownHandler(e) {
    // console.log(e);
    if (e.code == 'Space') {

    }
}

function drawBrick(brick) {
    ctx.beginPath();
    ctx.rect(brick.x, brick.y, brick.width, brick.height);
    ctx.fillStyle = brick.fillStyle;
    ctx.strokeStyle = brick.strokeStyle;
    ctx.lineWidth = brick.lineWidth;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}