class Enemy {
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1/this.fps;
        console.log(this.frameInterval);
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        this.x -= (this.vx + this.game.speed) * deltaTime;
        this.y += this.vy;
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame){
                this.frameX++;
            }
            else{
                this.frameX = 0;
            }
        }
        else {
            this.frameTimer += deltaTime;
        }
        //check if off screen
        if (this.x + this.width < 0){
            this.markedForDeletion = true;
        }
    }
    draw(context){
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 44;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.vx = 200;
        this.vy = 0;
        this.maxFrame = 5;
        this.image = document.getElementById('enemy_fly');
        this.angle = 0;
        this.va = Math.random() * 10 + 10
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va * deltaTime;
        this.y += 100 * Math.sin(this.angle) * deltaTime;
    }

}

export class GroundEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width - 20;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('enemy_plant');
        this.vx = 0;
        this.vy = 0;
        this.maxFrame = 1;
    }
    
}

export class ClimbingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        this.image = document.getElementById('enemy_spider_big');
        this.vx = 0;
        this.vy = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
    }
    update(deltaTime){
        super.update(deltaTime);
        if (this.y > this.game.height - this.height - this.game.groundMargin){
            this.vy *= -1;
        }
        if(this.y < -this.height){
            this.markedForDeletion = true;
        }
    }
    draw(context){
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x + this.width/2, 0);
        context.lineTo(this.x + this.width/2, this.y + 50);
        context.stroke();
    }
    
}