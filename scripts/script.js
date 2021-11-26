'use strict';

let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');

class Hero {
    constructor() {
        this.x = 50;
        this.y0 = this.y = canvas.height - 172;
        this.vy = 0;
        this.width = 10;
        this.height = 30;
        this.jump = false;
        this.lineWidth = 1;
        this.fillStyle = '#FFFFFF';
        this.strokeStyle = '#000000';
    }
}

Hero.prototype.jump = function () {

}

Hero.prototype.draw = function () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

//---------------------------------------------------

class Background extends Image {
    constructor(vx = 0) {
        super();
        this.dx = 0;
        this.vx = vx;
    }
}


Background.prototype.init = function (source) {
    this.src = source;
    this.onload = function () {
        // this.draw(0, 0);
        ctx.drawImage(this, 0, 0, this.width, this.height)
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

Background.prototype.draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this, - this.dx, canvas.height - this.height, this.width, this.height);
    ctx.drawImage(this, this.width - this.dx, canvas.height - this.height, this.width, this.height);
}

let image = {
    background: new Background(1)
}

image.background.init('images/Background.png');

let player = new Hero();


function draw() {
    // Перемещение задника
    image.background.dx += image.background.vx
    if (image.background.dx >= image.background.width) {
        image.background.dx = 0;
    }

    if (player.jump == true) {
        player.vy -= 4;
    }

    player.y += player.vy;

    player.vy += 1;

    // player.y >= player.y0 ? player.y = player.y0 : player.vy += 1;
    if (player.y >= player.y0) {
        player.y = player.y0;
        player.vy = 0;
    } else if (player.y < player.y0 && player.jump == false) {
        player.vy += 1;
    }

    /* if(player.y < player.y0) {
        player.vy += 1;
        player.y += player.vy;
    } else {
        player.y = player.y0
    } */

    image.background.draw();
    player.draw();
    requestAnimationFrame(draw);
}

draw();
