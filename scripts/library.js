'use strict';

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    // console.log(e);
    if (e.code == 'Space') {
        control.jump = true;
    }

    if (e.code == 'ArrowRight') {
        control.stepRequest = true;
    }
}

function keyUpHandler(e) {
    // console.log(e);
    if (e.code == 'Space') {
        control.jump = false;
    }
}