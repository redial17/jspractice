export default class InputHandler {
    constructor(){
        this.lastKey = '';
        window.addEventListener('keydown', (e) =>{
            console.log(e.key);
            switch(e.key){
                case "a":
                    this.lastKey = "PRESS a";
                    break;
                case "d":
                    this.lastKey = "PRESS d";
                    break;
                case "s":
                    this.lastKey = "PRESS s";
                    break;                
            }
        });
        window.addEventListener('keyup', (e) =>{
            switch(e.key){
                case "a":
                    this.lastKey = "RELEASE a";
                    break;
                case "d":
                    this.lastKey = "RELEASE d";
                    break;
                case "s":
                    this.lastKey = "RELEASE s";
                    break;
                    
            }
        });
    }
}