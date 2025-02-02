export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        //score
        context.fillText('Score: ' + this.game .score, 20 ,50);
        //timer
        context.font = this.fontSize * 0.8 + ' px' + this.fontFamily;
        context.fillText('Time: ' + this.game.time.toFixed(1), 20, 80);
        //game over message
        if (this.game.gameOver){
            if(this.game.score > 50){
                context.textAlign = 'center';
                context.font = this.fontSize * 2 + ' px' + this.fontFamily;
                context.fillText('YOU WIN', this.game.width * 0.5, this.game.height * 0.5);
            }
            else{
                context.textAlign = 'center';
                context.font = this.fontSize * 2 + ' px' + this.fontFamily;
                context.fillText('GAME OVER', this.game.width * 0.5, this.game.height * 0.5);
            }

        }
        context.restore();
    }

}