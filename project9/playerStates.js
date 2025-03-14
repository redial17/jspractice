import { Dust, Fire, Splash} from "./particles.js";

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
}

class State {
    constructor(state, game){
        this.state = state;
        this.game = game;
    }

}

export class Sitting extends State {
    constructor(game){
        super('SITTING', game);
    }
    enter(){
        this.frameX = 0;
        this.game.player.frameY = 5;
        this.game.player.maxFrame = 4;
    }
    handleInput(input){
        if (input.includes('a') || input.includes('d')){
            this.game.player.setState(states.RUNNING, 100);
        }
        if (input.includes(' ')){
            this.game.player.setState(states.JUMPING, 0);
        }
        if (input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 200);
        }
    }
}

export class Running extends State {
    constructor(game){
        super('RUNNING', game);
    }
    enter(){
        this.frameX = 0;
        this.game.player.frameY = 3;
        this.game.player.maxFrame = 8;
    }
    handleInput(input){
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width/2, this.game.player.y + this.game.player.height));
        if (input.includes('s')){
            this.game.player.setState(states.SITTING, 0);
        }
        if (input.includes(' ')){
            this.game.player.setState(states.JUMPING, 100);
        }
        if (input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 200);
        }
    }
}

export class Jumping extends State {
    constructor(game){
        super('JUMPING', game);
    }
    enter(){
        this.frameX = 0;
        this.game.player.frameY = 1;
        this.game.player.maxFrame = 6;
        if(this.game.player.onGround()){
            this.game.player.vy += -1000;
        }
    } 
    handleInput(input){
        if (this.game.player.vy >= 0){
            this.game.player.setState(states.FALLING, 100);
        }
        if (input.includes('Enter')){
            this.game.player.setState(states.ROLLING, 200);
        }
        if(input.includes('s')){
            this.game.player.setState(states.DIVING, 100);
        }
    }
}


export class Falling extends State {
    constructor(game){
        super('FALLING', game);
    }
    enter(){
        this.frameX = 0;
        this.game.player.frameY = 2;
        this.game.player.maxFrame = 6;
    }
    handleInput(input){
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 100);
        }
        if(input.includes('s')){
            this.game.player.setState(states.DIVING, 100);
        }
    }
}

export class Rolling extends State {
    constructor(game){
        super('ROLLING', game);
    }
    enter(){
        this.frameX = 0;
        this.game.player.frameY = 6;
        this.game.player.maxFrame = 6;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width/2, this.game.player.y + this.game.player.height/2));
        if (!input.includes('Enter') && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 100);
        }
        else if (!input.includes('Enter') && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 100);
        }
        else if (input.includes(' ') && this.game.player.onGround()){
            this.game.player.setState(states.JUMPING, 100);
        }
        else if (input.includes('s') && !this.game.player.onGround()){
            this.game.player.setState(states.DIVING, 100);
        }
    }
}

export class Diving extends State {
    constructor(game){
        super('DIVING', game);
    }
    enter(){
        this.frameX = 0;
        this.game.player.frameY = 6;
        this.game.player.maxFrame = 6;
        this.game.player.vy = 600;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width/2, this.game.player.y + this.game.player.height/2));
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 100);
            for(let i = 0; i < 30; i++){
                this.game.particles.unshift(new Splash(this.game, this.game.player.x, this.game.player.y));
            }
        }
        if (input.includes('Enter') && this.game.player.onGround()){
            this.game.player.setState(states.ROLLING, 100);
        }
    }
}

export class Hit extends State {
    constructor(game){
        super('HIT', game);
    }
    enter(){
        this.frameX = 0;
        this.game.player.frameY = 4;
        this.game.player.maxFrame = 10;
    }
    handleInput(input){
        if (this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 100);
        }
        else if (this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 100);
        }
    }
}

