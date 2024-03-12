'use strict';

let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');

let gameControl = {
    status: 1,
    distance: 0,
    enemyArray: [],
    keys: {
        jump: {
            bind: 'Space',
            state: false
        }
    },
    frames: {
        last: Date.now(),
        length: Math.floor(1000 / 60),
        elapsed: null,
        fps: {
            current: null,
            history: [],
            avg: null
        },
        // elapsed: this.last - this.length,
        frameRequest: function () {
            gameControl.frames.elapsed = Date.now() - gameControl.frames.last
            if (gameControl.frames.elapsed >= gameControl.frames.length) {
                gameControl.frames.last = Date.now();
                gameControl.frames.fps.current = Math.round(1000 / gameControl.frames.elapsed);
                gameControl.frames.countAvgFPS();
                return true
            } else {
                // console.log(gameControl.frames.elapsed);
                return false
            }
        },
        countAvgFPS: function () {
            if (gameControl.frames.fps.current != null) {
                if (gameControl.frames.fps.history.length <= 99) {
                    gameControl.frames.fps.history.push(gameControl.frames.fps.current);
                } else {
                    gameControl.frames.fps.history.shift();
                    gameControl.frames.fps.history.push(gameControl.frames.fps.current);
                }
            }

            let sum = 0;
            let length = gameControl.frames.fps.history.length;
            for (let i = 0; i <= length - 1; i++) {
                sum += gameControl.frames.fps.history[i];
            }
            let output = Math.round(sum / length);
            // console.log(output);
            gameControl.frames.fps.avg = output;
        }
    }
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
        this.alive = true;
    }

    jumpCheck() {
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
        if (this.jump.isActive == false && this.jump.inAir == false && gameControl.keys.jump.state == true) {
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
            && gameControl.keys.jump.state == true && this.fall.isActive == false) {
            this.vy += this.fall.ay - this.jump.ayCorr;
        } else if (this.y < this.y0 && this.jump.inAir == true) {
            this.vy += 1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // new Hero().enemyHitCheck();
    }

    enemyHitCheck() {
        for (let i = 0; i <= gameControl.enemyArray.length - 1; i++) {
            if (
                gameControl.enemyArray[i].y < this.y + this.height &&
                gameControl.enemyArray[i].y > this.y - gameControl.enemyArray[i].height &&
                gameControl.enemyArray[i].x < this.x + this.width &&
                gameControl.enemyArray[i].x > this.x - gameControl.enemyArray[i].width &&
                gameControl.enemyArray[i].alive == true
            ) {
                gameControl.enemyArray[i].alive = false;
                // console.log('Hit!!!', gameControl.enemyArray[i].y, gameControl.enemyArray[i].x, this.y + this.height, this.y - gameControl.enemyArray[i].height, this.x + this.width, this.x - gameControl.enemyArray[i].width);
                gameControl.enemyArray[i].fillStyle = gameControl.enemyArray[i].deadStyle;
            }
        }
    }
}

class Background extends Image {
    constructor(vx = 0) {
        super();
        this.dx = 0;
        this.vx = vx;
    }

    init(source) {
        this.src = source;
        this.onload = function () {
            ctx.drawImage(this, 0, 0, this.width, this.height)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    draw() {
        ctx.drawImage(this, - this.dx, canvas.height - this.height, this.width, this.height);
        ctx.drawImage(this, this.width - this.dx, canvas.height - this.height, this.width, this.height);
    }

    move() {
        this.dx += this.vx
        if (this.dx >= this.width) {
            this.dx = 0;
        }
    }

}

class Animation extends Image {
    constructor(duration = 1, numberOfFrames = 1) {
        super();
        this.animation = {
            duration: duration,
            length: numberOfFrames,
            width: null,
            height: null,
            frame: {
                number: 0,
                width: null, //this.width / numberOfFrames,
                height: null //this.height
            }
        }
    }

    init(source) {
        this.src = source;
        this.onload = function () {
            ctx.drawImage(this, 0, 0, this.width, this.height);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.animation.width = this.width;
            this.animation.height = this.height;
            this.animation.frame.width = this.width / this.animation.length;
            this.animation.frame.height = this.height;
            // console.log(this.)
        }
    }

    draw(x = 0, y = 0) {
        // В целом анимация работает, но какие-то проблемы с размером изображения + нет настройки скорости воспроизведения анимации (Пока не понимаю как это должно работать)
        ctx.drawImage(this, this.animation.frame.width * this.animation.frame.number, 0,
            this.animation.frame.width, this.animation.frame.height,
            x, y,
            this.width, this.height);

        this.animation.frame.number >= this.animation.length - 1 ? this.animation.frame.number = 0 : this.animation.frame.number++;
    }

}

class Text {
    constructor(x, y, text, maxWidth) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.font = '40px serif';
        this.fillStyle = '#35A1FF';
        this.maxWidth = maxWidth;
    }
    draw(text) {
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.fillText(text, this.x, this.y, this.maxWidth);
    }

}

class Wall {
    constructor(x, y, width, height, vx = 1) {
        this.x = x;
        this.distanceTraveled = 0;
        this.vx = vx;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spawnRate = 0.1;
        this.alive = true;
        this.groupArr = 'enemyArray';
        this.fillStyle = '#FFFFFF';
        this.deadStyle = '#FF0000';
        this.strokeStyle = '#000000';
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    init() {
        let wall = new Wall(canvas.width, canvas.height - 172, 10, 30)
        // let wall = new Wall(100, canvas.height - 172, 10, 30)
        if (typeof gameControl[this.groupArr] == 'undefined') {
            gameControl[this.groupArr] = [wall];
        } else {
            gameControl[this.groupArr].push(wall);
        }
    }
    move() {
        this.x -= this.vx;
        this.distanceTraveled += 1;
        // console.log('Enemy num: ', gameControl.enemyArray.length);
        new Wall().despawn();
    }
    spawn() {
        let spawnDistance = 100;
        let wall = new Wall(canvas.width, canvas.height - 172, 10, 30);
        if (gameControl[this.groupArr].length == 0) {
            gameControl[this.groupArr].push(wall);
        } else if (gameControl[this.groupArr][gameControl[this.groupArr].length - 1].distanceTraveled >= spawnDistance
            && Math.random() <= 0.01) {
            gameControl[this.groupArr].push(wall);
        }
    }
    despawn() {
        for (let i = 0; i <= gameControl[this.groupArr].length - 1; i++) {
            if (gameControl[this.groupArr][i].x <= -20) {
                gameControl[this.groupArr].splice(i, 1);
            }
        }
        // console.log(gameControl[this.groupArr].length);
    }
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
let fpsCounter = new Text(canvas.width - 130, 50, 'fps: ');
let distanceCounter = new Text(30, 50, 'Distance: ');


console.log(gameControl);

function draw() {

    if (gameControl.frames.frameRequest()) {
        gameControl.distance += image.background.vx / 100;
        new Wall().spawn();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // image.hero.run.draw(100, 100);
        player.jumpCheck();
        image.background.draw();
        image.background.move();
        for (let i = 0; i <= gameControl.enemyArray.length - 1; i++) {
            gameControl.enemyArray[i].draw();
            gameControl.enemyArray[i].move();
        }
        player.enemyHitCheck();
        player.draw();
        fpsCounter.draw('fps: ' + gameControl.frames.fps.avg);
        distanceCounter.draw('Distance: ' + Math.floor(gameControl.distance));

    }



    requestAnimationFrame(draw);
}

draw();
