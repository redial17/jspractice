export const states = {
    STANDING_RIGHT: 0,
    STANDING_LEFT: 1,
    SITTING_LEFT: 2,
    SITTING_RIGHT: 3,
}

class State {
    constructor(state){
        this.state = state;
    }
}

export class StandingLeft extends State {
    constructor(player){
        super('STANDING LEFT');
        this.player = player;
    }
    enter(){
        this.player.frameY = 1;
    }
    handleInput(input){
        if (input === 'PRESS d'){
            this.player.setState(states.STANDING_RIGHT);
        }
        else if (input === 'PRESS s'){
            this.player.setState(states.SITTING_LEFT);
        }
    }
}

export class StandingRight extends State {
    constructor(player){
        super('STANDING RIGHT');
        this.player = player;
    }
    enter(){
    this.player.frameY = 0;       
    }
    handleInput(input){
        if(input === 'PRESS a'){
            this.player.setState(states.STANDING_LEFT);
        }
        else if(input === 'PRESS s'){
            this.player.setState(states.SITTING_RIGHT);
        }
    }
}

export class SittingLeft extends State {
    constructor(player){
        super('SITTING LEFT');
        this.player = player;
    }
    enter(){
    this.player.frameY = 9;       
    }
    handleInput(input){
        if(input === 'PRESS d'){
            this.player.setState(states.SITTING_RIGHT);
        }
        else if(input === 'RELEASE s'){
            this.player.setState(states.STANDING_LEFT);
        }
    }
}

export class SittingRight extends State {
    constructor(player){
        super('SITTING Right');
        this.player = player;
    }
    enter(){
    this.player.frameY = 8;       
    }
    handleInput(input){
        if(input === 'PRESS a'){
            this.player.setState(states.SITTING_LEFT);
        }
        else if(input === 'RELEASE s'){
            this.player.setState(states.STANDING_RIGHT);
        }
    }
}