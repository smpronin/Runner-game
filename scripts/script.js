'use strict';

let canvas = document.getElementById('canvas1');
let ctx = canvas.getContext('2d');

let gameControl = {
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
                // console.log(gameControl.frames.fps.history)
            }

            let sum = 0;
            let length = gameControl.frames.fps.history.length; //Math.min(gameControl.frames.fps.history.length, 10);
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
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.font = '40px serif';
        this.fillStyle = '#35A1FF';
        this.maxWidth = 100;
    }
    draw(text) {
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.fillText(text, this.x, this.y, this.maxWidth);
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
let fpsCounter = new Text(canvas.width - 110, 50, 'fps: ');


function draw() {

    if (gameControl.frames.frameRequest()) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // image.hero.run.draw(100, 100);
        image.background.move();
        player.jumpCheck();
        image.background.draw();
        player.draw();
        fpsCounter.draw('fps: ' + gameControl.frames.fps.avg);
    }



    requestAnimationFrame(draw);
}

draw();
