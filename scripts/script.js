'use strict';

let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');


let image = {
    backGround: new Image()
}

image.backGround.src = 'images/BackGround.png';

let brick = {
    x: 50,
    y: canvas.height - 172,
    vy: 5,
    width: 10,
    height: 30,
    lineWidth: 1,
    fillStyle: '#FFFFFF',
    strokeStyle: '#000000'
}

image.backGround.onload = function () {
    ctx.drawImage(image.backGround, 0, 0, image.backGround.width, image.backGround.height);
}

let x = 0;
let vx = 1;

function draw() {
    x += 1
    if (x >= image.backGround.width) {
        x = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image.backGround, -x, canvas.height - image.backGround.height, image.backGround.width, image.backGround.height);
    ctx.drawImage(image.backGround, image.backGround.width - x, canvas.height - image.backGround.height, image.backGround.width, image.backGround.height);
    drawBrick(brick);
    requestAnimationFrame(draw);
}

draw();

