export class InputHandler {
    constructor(game){
        this.game = game;
        this.keys = [];
        this.keyboradKeys = [];
        this.gamepadKeys = [];
        this.gamepad;
        window.addEventListener('keydown', e => {
            console.log(e.key);
            if ((e.key === 'w' ||
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd' ||
                e.key === 'Enter' ||
                e.key === ' ' )
                && this.keyboradKeys.indexOf(e.key) === -1){
                this.keyboradKeys.push(e.key);
            }else if(e.key === 'q'){
                this.game.debug = !this.game.debug;
            }
            else if(e.key === 'Escape'){
                //pause the game
                this.game.pause = !this.game.pause;
            }
        });
        window.addEventListener('keyup', e => {
            if  (e.key === 'w' ||
                e.key === 'a' ||
                e.key === 's' ||
                e.key === 'd' ||
                e.key === 'Enter' ||
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