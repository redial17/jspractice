//set fps
let lastTime =0;
let fps = 60;
let interval = 1000 / fps;
let deltaTime = 0;

let playerState = 'idle';

//standard method to link to html
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function(e){
    playerState = e.target.value;
});

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx);

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'shadow_dog.png';
let x = 0;
const spriteWidth = 575;
const spriteHeight = 523;


//let frameX = 0;
//let frameY = 0;

let gameFrame = 0;
const staggerFrame = 5;
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'gethit',
        frames: 4,
    },
]

animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    for(let j = 0; j < state.frames; j++){
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight
        frames.loc.push({x: positionX, y: positionY});
    }
    spriteAnimations[state.name] = frames;
});

console.log(spriteAnimations);

function animate(time){
    deltaTime = time - lastTime;
    if(deltaTime > interval){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        //loop the image
        let positon = Math.floor(gameFrame/staggerFrame) % spriteAnimations[playerState].loc.length;
        let frameX = spriteWidth * positon;
        let frameY = spriteAnimations[playerState].loc[positon].y;
        ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth,
        spriteHeight);
    
        gameFrame++;
        lastTime = time;
    }
    
    requestAnimationFrame(animate);
};
animate(0);
