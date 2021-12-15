'use strict';

let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');

let control = {
    jump: false
}

class Hero {
    constructor() {
        this.jump = {
            isActive: false,
            inAir: false,
            ay: 15,
            ayCorr: 0.6
        }
        this.fall = {
            isActive: false,
            ay: 1
        }
        this.x = 50;
        this.y0 = this.y = canvas.height - 172;
        this.vy = 0;
        this.width = 10;
        this.height = 30;
        this.lineWidth = 1;
        this.fillStyle = '#FFFFFF';
        this.strokeStyle = '#000000';
    }
}

Hero.prototype.jumpCheck = function () {

    // Расчёт положения игрока
    if (this.y < this.y0) {
        this.jump.inAir = true
    } else { this.jump.inAir = false }

    if (this.vy > 0) {
        this.fall.isActive = true;
    } else {
        this.fall.isActive = false;
    }

    // Расчёт прыжка
    if (this.jump.isActive == false && this.jump.inAir == false && control.jump == true) {
        this.jump.isActive = true;
    }
    if (this.jump.isActive == true && this.jump.inAir == false) {
        this.vy -= this.jump.ay;
        this.jump.isActive = false;
    }

    this.y += this.vy;

    if (this.y >= this.y0) {
        this.y = this.y0;
        this.vy = 0;
    } else if (this.y < this.y0 && this.jump.inAir == true
        && control.jump == true && this.fall.isActive == false) {
        this.vy += this.fall.ay - this.jump.ayCorr;
    } else if (this.y < this.y0 && this.jump.inAir == true) {
        this.vy += 1;
    }

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
        ctx.drawImage(this, 0, 0, this.width, this.height)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

Background.prototype.draw = function () {
    ctx.drawImage(this, - this.dx, canvas.height - this.height, this.width, this.height);
    ctx.drawImage(this, this.width - this.dx, canvas.height - this.height, this.width, this.height);
}

Background.prototype.move = function () {
    this.dx += this.vx
    if (this.dx >= this.width) {
        this.dx = 0;
    }
}

//-------------------------------------------------------------

class Animation extends Image {
    constructor(duration = 1, numberOfFrames = 1) {
        super();
        this.animation = {
            duration: duration,
            length: numberOfFrames,
            frame: {
                number: 0,
                width: this.width / numberOfFrames,
                height: this.height
            }
        }
    }
}

Animation.prototype.init = function (source) {
    this.src = source;
    this.onload = function () {
        ctx.drawImage(this, 0, 0, this.width, this.height)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

Animation.prototype.draw = function (x = 0, y = 0) {
    ctx.drawImage(this, x /* - this.animation.frame.length * this.animation.number */, y, this.width, this.height);
    // this.animation.number >= this.animation.length ? this.animation.number = 0 : this.animation.number++;
}

//=============================================================

let image = {
    background: new Background(1),
    hero: {
        run: new Animation(1, 4)
    }
}

image.background.init('images/Background.png');
image.hero.run.init('images/HeroRun.png');



let player = new Hero();


// Разобраться с определением размеров картинок, не получается произвести расчёты!!!!!!!!!!!!!!!!!!!!
console.log([image.hero.run]);
console.log(image.hero.run.height);
console.log(image.background.height);

function draw() {

    image.hero.run.draw(0, 0);

    /* ctx.clearRect(0, 0, canvas.width, canvas.height);
    image.background.move();
    player.jumpCheck();
    image.background.draw();
    player.draw(); */

    requestAnimationFrame(draw);
}

draw();
