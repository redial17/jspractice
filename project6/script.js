/**@type {HTMLCanvasElement} */
console.log('hh')
window.addEventListener('load', function(){
    console.log('hh')
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 500;
    const CANVAS_HEIGHT = canvas.height = 800;
    
    class Game {
        constructor(ctx, width, height){
            this.ctx = ctx;
            this.width = width;
            this.height = height
            this.enemies = [];
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'ghost', 'spider'];
        }
        update(deltaTime){
            this.enemies = this.enemies.filter(object => !object.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval){
                this.#addNewEnemy();
                this.enemyTimer = 0;
                console.log(this.enemies);
            }
            else{
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(object => object.update(deltaTime));
        }
        draw(){
            this.enemies.forEach(object => object.draw(this.ctx));
        }
        #addNewEnemy(){
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            console.log(Math.floor(Math.random() * this.enemyTypes.length));
            if (randomEnemy == 'worm'){
                this.enemies.push(new Worm(this));
            }
            else if(randomEnemy == 'ghost'){
                this.enemies.push(new Ghost(this));
            }
            else if(randomEnemy == 'spider'){
                this.enemies.push(new Spider(this));
            }
            this.enemies.sort(function(a,b){
                return a.y - b.y;
            });
        }
    }
    
    class Enemy {
        constructor(game){
            this.game = game;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimmer = 0;
        }
        update(deltaTime){
            this.x -= this.vx * deltaTime;
            if (this.x < - this.width){
                this.markedForDeletion = true;
            }
            if (this.frameTimmer > this.frameInterval){
                if(this.frameX < this.maxFrame){
                    this.frameX++;
                }
                else{
                    this.frameX = 0;
                }
                this.frameTimmer = 0;
            }
            else{
                this.frameTimmer += deltaTime;
            }
        }
        draw(ctx){
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class Worm extends Enemy {
        constructor(game){
            super(game);
            this.image = worm;
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.x = this.game.width;
            this.y = this.game.height - this.height;
            this.vx = Math.random() * 0.1 + 0.1;

        }
    }

    class Ghost extends Enemy {
        constructor(game){
            super(game);
            this.image = ghost;
            this.spriteWidth = 261;
            this.spriteHeight = 209;
            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.6;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.vx = Math.random() * 0.2 + 0.1;
            this.angle = 0;
            this.amplitude = Math.random() * 0.2;
        }
        update(deltaTime){
            super.update(deltaTime);
            this.y +=  Math.sin(this.angle) * this.amplitude * deltaTime;
            this.angle += 0.001 * deltaTime;
        }
        draw(ctx){
            ctx.save();
            ctx.globalAlpha = 0.5;
            super.draw(ctx);
            ctx.restore();
        }
    }

    class Spider extends Enemy {
        constructor(game){
            super(game);
            this.image = spider;
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth * 0.5;
            this.height = this.spriteHeight * 0.5;
            this.x = Math.random() * (this.game.width - this.width -10) + this.width * 0.5;
            this.y = -this.height;
            this.vx = 0;
            this.vy = Math.random() * 0.2 + 0.1;
            this.maxLength = Math.random() * (game.height - this.height);
        }
        update(deltaTime){
            super.update(deltaTime);
            if(this.y < -this.height * 2){
                this.markedForDeletion = true;
            }
            this.y += this.vy * deltaTime;
            if (this.y > this.maxLength){
                this.vy *= -1;
            }
        }
        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.5, 0);
            ctx.lineTo(this.x + this.width * 0.5, this.y + this.height * 0.5);
            ctx.stroke();
            super.draw(ctx);
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    let lastTime = 0;
    function animate(timestamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        game.update(deltaTime);
        game.draw();
        requestAnimationFrame(animate);
    }
    animate(0);
    
});
