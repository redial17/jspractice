const button = document.querySelector('button');
const board = document.querySelector('.board');
let playable = true;
let mines = [];
let untouchedTile = [];

button.addEventListener('click', () => {
    playable = true;
    initBoard();
});

function initBoard(){
    while(board.firstChild) {
        board.removeChild(board.firstChild);
    }
    while(mines.length !== 0){
        mines.shift(0);
    }
    while(untouchedTile.length !== 0){
        untouchedTile.shift(0);
    }

    for(let i = 0; i < 400; i++){
        let div = document.createElement('div');
        div.id = `tile_${i + 1}`;
        if(Math.random() < 0.1){
            mines.push(div);
        }
        untouchedTile.push(div);
        div.addEventListener('click', () => {
            if(!playable){
                return;
            }
            if(mines.includes(div)){
                div.textContent = '*';
                playable = false;
                div.className = 'bomb';
                alert('lose');
            }
            else{
                div.className = 'clear';
                if(mineNeighbours(div) > 0){
                    let num = mineNeighbours(div);
                    div.textContent = `${num}`;
                }
            }
            untouchedTile.pop(div);
            // compare the 2d array
            if(comapre(mines, untouchedTile)){
                alert('win');
                playable = false;
            }
        });
        board.appendChild(div);
    }
}

function comapre (mines, untouchedTile){
    if(mines.length !== untouchedTile.length){
        return false;
    }
    for(let i = 0; i < mines.length-1; i++){
        if(mines[i].id !== untouchedTile[i].id){
            return false;
        }
    }
    return true;
}

function mineNeighbours (tile){
    let num = 0;
    let id;
    let match = tile.id.match(/\d+/);
    if(match) {
        id = parseInt(match[0]);
    }

    if(id % 20 !== 1){
        let left = document.getElementById(`tile_${id-1}`);
        if(mines.includes(left)) num++;
    }
    if(id % 20 !== 0){
        let right = document.getElementById(`tile_${id+1}`);
        if(mines.includes(right)) num++;
    }
    if(id > 20){
        let up = document.getElementById(`tile_${id-20}`);
        if(mines.includes(up)) num++;
    }
    if(id <= 380) {
        let down = document.getElementById(`tile_${id+20}`);
        if(mines.includes(down)) num++;
    }
    if(id % 20 !== 1 && id % 20 !== 0 && id > 20 && id <= 380){
        let dia1 = document.getElementById(`tile_${id-20-1}`);
        if(mines.includes(dia1)) num++;
        let dia2 = document.getElementById(`tile_${id-20+1}`);
        if(mines.includes(dia2)) num++;
        let dia3 = document.getElementById(`tile_${id+20-1}`);
        if(mines.includes(dia3)) num++;
        let dia4 = document.getElementById(`tile_${id+20+1}`);
        if(mines.includes(dia4)) num++;
    }
    return num;
}
