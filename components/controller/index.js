let control = {
    tile_count: 16,
    tileDim: Math.sqrt(this.tile_count),
    activeTiles: [],
    inactiveTiles: [],
    clearTiles: [],
    emptyTiles: [],
    meatTiles: [],
    doorTile: -1,
    keyTile: -1,
    highScore: 0,
    score: 0,
    hunger: 20,
    startHunger: 20,
    foodCount: 1,
    foodHeal: 10,
    hasKey: false,
    gameOver: false
}

control.tileDim = Math.sqrt(control.tile_count);
control.createRoom = function createRoom(){
    const room = document.createElement('div');
    const score = document.createElement('h2');
    const hunger = document.createElement('h2');
    const keyScore = document.createElement('img');
    score.textContent = `Score: ${control.score}`;
    hunger.textContent = `Food: ${control.hunger}`;
    keyScore.src = './assets/key.png';
    score.classList.add('score');
    hunger.classList.add('hunger');
    room.classList.add('room');
    keyScore.classList.add('keyScore');

    document.querySelector('.start-btn').style.display = 'none';

    randomizeLoot(control.tile_count);
    for(let i = 0; i < control.tile_count; i++){
        room.append(createTile(control.tileDim, i))
    }
    const game = document.querySelector('.game');
    game.append(score);
    game.append(hunger);
    game.append(keyScore);
    game.append(room);
    setDoor();
    return room;
}

function createTile(tileDim, tileNo){
    const tile = document.createElement('div');
    const tileWidth = 100 / tileDim;
    tile.classList.add('tile', 'covered', `tile_${tileNo}`);
    tile.style.width = `${tileWidth}%`

    return tile;
}

function randomizeLoot(roomSize){
    control.emptyTiles = [...Array(roomSize).keys()];
    control.inactiveTiles = [...Array(roomSize).keys()];
    //Add door
    control.doorTile = control.emptyTiles[Math.floor(Math.random()*control.emptyTiles.length)];
    removeEmpty(control.doorTile);
    removeInactive(control.doorTile);
    //Add key
    control.keyTile = control.emptyTiles[Math.floor(Math.random()*control.emptyTiles.length)];
    removeEmpty(control.keyTile);
    //Add meat
    const meatCount = Math.floor(Math.random() * 3 + control.foodCount);
    for(let i = 0; i < meatCount; i++){
        const thisMeat = control.emptyTiles[Math.floor(Math.random()*control.emptyTiles.length)];
        control.meatTiles.push(thisMeat);
        removeEmpty(thisMeat);
    }
}

function removeEmpty(tileNo){
    let index = control.emptyTiles.indexOf(tileNo);
    if(index > -1)
        control.emptyTiles.splice(index, 1);
}

function refreshActive(){
    for(let i = 0; i < control.inactiveTiles.length; i++){
        if( (control.clearTiles.includes(control.inactiveTiles[i] + 1) && ( (control.inactiveTiles[i] + 1) % control.tileDim != 0 ) ) || 
             control.clearTiles.includes(control.inactiveTiles[i] + control.tileDim) ||
            (control.clearTiles.includes(control.inactiveTiles[i] - 1) && control.inactiveTiles[i] % control.tileDim != 0) || 
             control.clearTiles.includes(control.inactiveTiles[i] - control.tileDim)){
                control.activeTiles.push(control.inactiveTiles[i]);
                setActive(control.inactiveTiles[i]);
           }
    }
    removeInactive();
}

function removeInactive(){
    for(let i = 0; i < control.activeTiles.length; i++){
        if(control.inactiveTiles.includes(control.activeTiles[i])){
            control.inactiveTiles.splice(control.inactiveTiles.indexOf(control.activeTiles[i]), 1);
            const active = document.querySelector(`.tile_${control.activeTiles[i]}`)
            active.classList.toggle('activeTile');
            active.classList.toggle('covered');
        }
    }
}

function setDoor(){
    const door = document.querySelector(`.tile_${control.doorTile}`);
    control.inactiveTiles.splice(control.inactiveTiles.indexOf(control.doorTile), 1);
    door.classList.toggle('covered');
    door.classList.toggle('doorTile');
    door.addEventListener('click', () => {
        if(control.hasKey && !control.gameOver){
            control.score++;
            control.hasKey = false;
            resetLevel();
        }
    })
    control.clearTiles.push(control.doorTile);
    refreshActive();
}

function setActive(tileNo){
    const tile = document.querySelector(`.tile_${tileNo}`);
    tile.addEventListener('click', () => {
        if(tile.classList.contains('activeTile') && !control.gameOver){
            tile.classList.toggle('activeTile');
            control.clearTiles.push(tileNo);
            changeHunger(-1);

            if(tileNo === control.keyTile){
                tile.classList.toggle('keyTile');
                tile.addEventListener('click', () => {
                    if(!control.hasKey && !control.gameOver){
                        control.hasKey = true;
                        tile.classList.toggle('keyTile');
                        tile.classList.toggle('clearTile');
                        document.querySelector('.keyScore').style.opacity = '100%';
                    }
                })
            }else if(control.meatTiles.includes(tileNo)){
                tile.classList.toggle('meatTile');
                tile.addEventListener('click', () => {
                    if(control.meatTiles.includes(tileNo) && !control.gameOver){
                        changeHunger(10);
                        tile.classList.toggle('meatTile');
                        tile.classList.toggle('clearTile');
                        control.meatTiles.splice(control.meatTiles.indexOf(tileNo), 1);
                    }
                })
            }
            else
                tile.classList.toggle('clearTile');
            refreshActive();
        }
    })
}

function resetLevel(){
    const score = document.querySelector('.score');
    const hunger = document.querySelector('.hunger');
    const keyScore = document.querySelector('.keyScore');
    const room = document.querySelector('.room');
    score.parentNode.removeChild(score);
    hunger.parentNode.removeChild(hunger);
    keyScore.parentNode.removeChild(keyScore);
    room.parentNode.removeChild(room);

    control.activeTiles = [];
    control.inactiveTiles = [];
    control.clearTiles = [];
    control.emptyTiles = [];
    control.meatTiles = [];
    control.doorTile = -1;
    control.keyTile = -1;
    control.hasKey = false;

    control.createRoom();
}

function changeHunger(deltaFood){
    control.hunger+=deltaFood;
    document.querySelector('.hunger').textContent = `Food: ${control.hunger}`;
    if(control.hunger <= 0){
        control.gameOver = true;
        if(control.highScore < control.score) 
            control.highScore = control.score;
        const gameOverScreen = document.createElement('div');
        gameOverScreen.classList.add('gameOver');
        document.querySelector('.container').append(gameOver());
    }
}

function gameOver(){
    const gameOverScreen = document.createElement('div');
    const gameOverTitle = document.createElement('h2');
    const gameOverScore = document.createElement('h3');
    const gameOverHighScore = document.createElement('h3');
    const gameOverResetButton = document.createElement('div');

    gameOverScreen.classList.add('gameOver');
    gameOverTitle.classList.add('gameOverTitle');
    gameOverScore.classList.add('gameOverScore');
    gameOverHighScore.classList.add('gameOverScore');
    gameOverResetButton.classList.add('gameOverResetButton');

    gameOverTitle.textContent = 'GAME OVER';
    gameOverScore.textContent = `Score: ${control.score}`;
    gameOverHighScore.textContent = `High Score: ${control.highScore}`;
    gameOverResetButton.textContent = 'Try Again'

    gameOverResetButton.addEventListener('click', () => {
        control.score = 0;
        control.hunger = control.startHunger;
        control.gameOver = false;
        const removeGameOver = document.querySelector('.gameOver');
        removeGameOver.parentNode.removeChild(removeGameOver);
        resetLevel();
    })

    gameOverScreen.append(gameOverTitle);
    gameOverScreen.append(gameOverScore);
    gameOverScreen.append(gameOverHighScore);
    gameOverScreen.append(gameOverResetButton);

    return gameOverScreen;
}