const button = document.querySelector('button');
const board = document.querySelector('.board');
let playable = true;
let mines = new Array(20).fill(null).map(()=> new Array(20).fill(null));
console.log(button);
console.log(board);
button.addEventListener('click', () => {
    playable = true;
    console.log('clicked!');
    initBoard();
    initmines();
    console.log(mines);
});

function initBoard(){
    while(board.firstChild) {
        board.removeChild(board.firstChild);
    }
    for(let i = 1; i <= 400; i++){
        let div = document.createElement('div');
        div.id = `tile_${i}`;
        let m = Math.floor(i/20);
        let n = i - m * 20;
        div.addEventListener('click', () => {
            if(mines[m][n] === true){
                div.textContent = '*';
                playable = false;
                alert('lose');
            }
        });
        board.appendChild(div);
    }
}


function initmines(){
    for (let i = 0; i < mines.length; i++) {
        for (let j = 0; j < mines[i].length; j++) {
            mines[i][j] = Math.random() < 0.9;
        }
    }
}



function touchTile (tile){

}
