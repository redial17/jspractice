/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

//hitbox
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
//set text
let gameOver = false;
let score = 0;
ctx.font = '50px Impact';

let timeToNextRaven = 0;
let ravenInterval = 0.5;
let lastTime = 0;

let ravens = [];
class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.speedX = Math.random() * 300 + 30;
        this.speedY = Math.random() * 300 - 25;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = 0.05;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb( ' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }
    update(deltaTime) {
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.speedY = -this.speedY;
        }
        this.x -= this.speedX * deltaTime;
        this.y -= this.speedY * deltaTime;
        if (this.x < -this.width) {
            this.markedForDeletion = true;
        }
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) {
                this.frame = 0;
            }
            else {
                this.frame++;
            }
            this.timeSinceFlap = 0;
            if(this.hasTrail){
                for(let i = 0; i < 5; i++){
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                }
            }
        }
        if (this.x < -this.width) {
            gameOver = true;
        }
    }
    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explosions = [];
class Explosion {
    constructor(x, y, size) {
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.frame = 0;
        this.timeSinceLastFrame = 0;
        this.frameInterval = 0.1;
        this.markedForDeletion = false;
    }
    update(deltaTime) {
        if (this.frame === 0) {
            this.sound.play();
        }
        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) {
                this.markedForDeletion = true;
            }
        }
    }
    draw() {
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size * 0.25, this.size, this.size);
    }
}

let particles = [];
class Particle {
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + size * 0.5;
        this.y = y + size * 0.3;
        this.radius = Math.random() * this.size * 0.1;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 200 + 50;
        this.color = color;
    }
    update(deltaTime){
        this.x += this.speedX * deltaTime;
        this.radius += 0.06;
        if(this.radius > this.maxRadius -5){
            this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80);
}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over, your score is ' + score, canvas.width * 0.5, canvas.height * 0.5);
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over, your score is ' + score, canvas.width * 0.5 + 5, canvas.height * 0.5 + 5);
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('click', function (e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
            object.markedForDeletion = true;
            score++;
            //generate explosion animation
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    })
})

function animate(timestamp) {
    let deltaTime = (timestamp - lastTime) * 0.001;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        //make big raven at front
        ravens.sort(function (a, b) {
            return a.width - b.width;
        })
    };
    drawScore();
    [ ...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [ ...particles, ...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    if (!gameOver) {
        requestAnimationFrame(animate);
    }
    else {
        drawGameOver();
    }
}
animate(0);