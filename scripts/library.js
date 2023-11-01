'use strict';

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    // console.log(e);
    if (e.code == gameControl.keys.jump.bind) {
        gameControl.keys.jump.state = true;
    }

    // if (e.code == 'ArrowRight') {
    //     // control.frameRequest = true;
    // }
}

function keyUpHandler(e) {
    // console.log(e);
    if (e.code == gameControl.keys.jump.bind) {
        gameControl.keys.jump.state = false;
    }
}