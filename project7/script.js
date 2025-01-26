/*
Upon restart, chances are that player will not correctly loaded
*/


/**@type {HTMLCanvasElement} */
window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let score = 0;
    let gameOver = false;

    class InputHandler {
        constructor(){
            this.keys = [];
            this.keyboradKeys = [];
            this.gamepadKeys = [];
            this.gamepad;
            window.addEventListener('keydown', e => {
                if ((e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 's' ||
                    e.key === 'd' ||
                    e.key === ' ' )
                    && this.keyboradKeys.indexOf(e.key) === -1){
                    this.keyboradKeys.push(e.key);
                }
                else if(e.key === 'Enter' && gameOver){
                    restartGame();
                }
            });
            window.addEventListener('keyup', e => {
                if  (e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 's' ||
                    e.key === 'd' ||
                    e.key === ' ' ){
                    this.keyboradKeys.splice(this.keyboradKeys.indexOf(e.key), 1);
                }
            });
            window.addEventListener('gamepadconnected',(e) =>{
                this.gamepad = e.gamepad;
            });

            window.addEventListener('gamepaddisconnected', (e)=>{
                this.gamepad = null;
            });
        }

        updateGamepad() {
            if (this.gamepad) {
                const gamepads = navigator.getGamepads();
                const gamepad = gamepads[this.gamepad.index];
                gamepad.buttons
    
                if (gamepad) {
                    const axisX = gamepad.axes[0];
    
                    if (axisX > 0.5 && !this.gamepadKeys.includes('d') ) {
                        this.gamepadKeys.push('d');
                    }
                    else if(axisX < -0.5 && !this.gamepadKeys.includes('a')){
                        this.gamepadKeys.push('a');
                    } 
                    else if (Math.abs(axisX) < 0.5 && (this.gamepadKeys.includes('a') || this.gamepadKeys.includes('d'))) {
                        this.gamepadKeys.splice(this.gamepadKeys.indexOf('a'), 1);
                        this.gamepadKeys.splice(this.gamepadKeys.indexOf('d'), 1);
                    }

                    if(gamepad.buttons[0].pressed && !this.gamepadKeys.includes(' ')){
                        this.gamepadKeys.push(' ');
                    }
                    else if(!gamepad.buttons[0].pressed && this.gamepadKeys.includes(' ')){
                        this.gamepadKeys.splice(this.gamepadKeys.indexOf(' '), 1);
                    }
                }
            }
            this.keys = [...new Set([...this.keyboradKeys, ...this.gamepadKeys])];
        }
    }

    class Player {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.maxFrame = 8;
            this.frameY = 0;
            this.vx = 0;
            this.vy = 0;
            this.gravity = 6000;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1/this.fps;
        }

        restart(){
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }
        draw(context){
            // context.strokeStyle = 'white';
            // context.beginPath();
            // context.arc(this.x+this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2);
            // context.stroke();
            // context.strokeStyle = 'blue';
            // context.beginPath();
            // context.arc(this.x, this.y, this.width/2, 0, Math.PI*2);
            // context.stroke();
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input, deltaTime, enemies){
            //collision detection
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2);
                const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);
                const distance = Math.sqrt(dx*dx + dy*dy);
                if(distance < enemy.width/2 + enemy.width/2){
                    gameOver = true;
                }
            });
            if(this.frameTimer > this.frameInterval){
                if(this.frameX >= this.maxFrame){
                    this.frameX = 0;
                }
                else{
                    this.frameX++;
                }
                this.frameTimer = 0;
            }
            else{
                this.frameTimer += deltaTime;
            }
            //horizontal
            if (input.keys.indexOf('d') > -1){
                this.vx = 1000;
            }
            else if (input.keys.indexOf('a') > -1){
                this.vx = -1000;
            }
            else {
                this.vx = 0;
            }

            this.x += this.vx * deltaTime;
            if (this.x < 0){
                this.x = 0;
            }
            if (this.x > this.gameWidth - this.width){
                this.x = this.gameWidth - this.width;
            }
            //vertical
            if(input.keys.indexOf(' ') > -1 && this.onGround()){
                this.vy = -2000;
            }
            this.y += this.vy * deltaTime;
            if(!this.onGround()){
                this.vy += this.gravity * deltaTime;
                this.maxFrame = 5;
                this.frameY = 1;
            }
            else {
                this.vy = 0; 
                this.frameY = 0;
                this.maxFrame = 8;
            }
            if (this.y > this.gameHeight -this.height){
                this.y = this.gameHeight - this.height;
            }
        }
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.vx = 500;
        }
        restart(){
            this.x = 0;
        }
        update(deltaTime){
            this.x -= this.vx * deltaTime;
        }
        draw(context,deltaTime){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.vx * deltaTime, this.y, this.width, this.height);
            if(this. x < -this.width){
                this.x = 0;
            }
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 4;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1/this.fps;
            this.vx = 400;
            this.markedForDeletion = false;
        }

        update(deltaTime){
            if(this.frameTimer > this.frameInterval){
                if(this.frameX > this.maxFrame){
                    this.frameX = 0;
                }
                else{
                    this.frameX++;
                }
                this.frameTimer = 0;
            }
            else{
                this.frameTimer += deltaTime;
            }
            this.x -= this.vx * deltaTime;
            if (this.x < - this.width){
                this.markedForDeletion = true;
                score++;
            }
        }
        draw(context){
            // context.strokeStyle = 'white';
            // context.beginPath();
            // context.arc(this.x+this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI*2);
            // context.stroke();
            // context.strokeStyle = 'blue';
            // context.beginPath();
            // context.arc(this.x, this.y, this.width/2, 0, Math.PI*2);
            // context.stroke();
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }

    }
    let enemies = [];

    function handleEnemies(deltaTime){
        if(enemyTimer > enemyInterval){
            enemies.push(new Enemy(canvas.width, canvas.height));
            enemyTimer = 0;
        }
        else{
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.update(deltaTime);
            enemy.draw(ctx);
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }

    function displayStatusText(context){
        context.textAlign = 'left';
        context.fillStyle = 'black';
        context.font = '40px Helvetica';
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white';
        context.fillText('Score: ' + score, 22, 52);

        if(gameOver){
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText('Game Over, press ENTER to try anain', canvas.width/2, canvas.height/2);
            context.fillStyle = 'white';
            context.fillText('Game Over, press ENTER to try anain', canvas.width/2 + 2, canvas.height/2 + 2);
        }
    }

    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 2;

    function animate(timestamp){
        input.updateGamepad();
        const deltaTime = (timestamp - lastTime)/1000;
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.update(deltaTime);
        background.draw(ctx,deltaTime);
        player.update(input, deltaTime, enemies);
        player.draw(ctx);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if(!gameOver){
            requestAnimationFrame(animate);
        }
    }
    animate(0);
});