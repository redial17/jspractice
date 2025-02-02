class Particle {
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
        this.frameTimer = 0;
        this.frameInterval = 0.01;
    }
    update(deltaTime) {
        this.x -= (this.vx + this.game.speed) * deltaTime;
        this.y -= this.vy * deltaTime;
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            this.size *= 0.95
        }
        else{
            this.frameTimer += deltaTime;
        }
        if (this.size < 0.5){
            this.markedForDeletion = true;
        }
    }
}

export class Dust extends Particle {
    constructor(game, x, y) {
        super(game);
        this.size = Math.random() * 10 + 10;
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 200;
        this.vy = Math.random() * 100;
        this.color = 'rgba(0,0,0,0.2)';
    }
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI*2);
        context.fillStyle = this.color;
        context.fill();
    }

}

export class Splash extends Particle {
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 100 + 100;
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 600 - 300;
        this.vy = Math.random() * 200 + 200;
        this.gravity = 0;
        this.image = document.getElementById('fire');
    }
    update(deltaTime){
        super.update(deltaTime);
        this.gravity += 0.5 * deltaTime;
        this.y += this.gravity * deltaTime;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}

export class Fire extends Particle {
    constructor(game, x, y) {
        super(game);
        this.image = document.getElementById("fire");
        this.size = Math.random() * 100 + 50;
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 200;
        this.vy = Math.random() * 200;
        this.angle = 0;
        this.va = Math.random() * Math.PI;
    }
    update(deltaTime) {
        super.update(deltaTime);
        this.angle += this.va;
        this.x += Math.sin(this.angle * 0.5);
    }
    draw(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size/2, -this.size/2, this.size, this.size);
        context.restore();
    }
}