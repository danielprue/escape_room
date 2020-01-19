let control = {
    tile_count: 16,
    tileDim: Math.sqrt(this.tile_count),
    activeTiles: [],
    inactiveTiles: [],
    clearTiles: [],
    emptyTiles: [],
    doorTile: -1,
    keyTile: -1,
    hasKey: false,
}

control.tileDim = Math.sqrt(control.tile_count);
control.createRoom = function createRoom(){
    const room = document.createElement('div');
    room.classList.add('room');

    document.querySelector('.start-btn').style.display = 'none';

    randomizeLoot(control.tile_count);
    for(let i = 0; i < control.tile_count; i++){
        room.append(createTile(control.tileDim, i))
    }
    document.querySelector('.game').append(room);
    setDoor();
    return room;
}

function createTile(tileDim, tileNo){
    const tile = document.createElement('div');
    const tileWidth = 100 / tileDim;
    tile.classList.add('tile', 'covered', `tile_${tileNo}`);
    tile.style.width = `${tileWidth}%`

    // tile.addEventListener('click', clickActive(this, tileNo))
    // () => {
    //     if(title.classList.contains('activeTile')){
    //         title.classList.toggle('activeTile');
    //         control.clearTiles.push(tileNo);
    //         if(title.classList.contains(`${control.keyTile}`)){
    //             title.classList.toggle('keyTile');
    //         }else{
    //             title.classList.toggle('clearTile')
    //         }
    //         refreshActive();
    //     }
    //})

    return tile;
}

function randomizeLoot(roomSize){
    control.emptyTiles = [...Array(roomSize).keys()];
    control.inactiveTiles = [...Array(roomSize).keys()];
    control.doorTile = control.emptyTiles[Math.floor(Math.random()*control.emptyTiles.length)];
    removeEmpty(control.doorTile);
    removeInactive(control.doorTile);
    control.keyTile = control.emptyTiles[Math.floor(Math.random()*control.emptyTiles.length)];
    removeEmpty(control.keyTile);
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
    // door.style.background = 'url(./assets/door.png) no-repeat'
    control.clearTiles.push(control.doorTile);
    refreshActive();
}

function setActive(tileNo){
    const tile = document.querySelector(`.tile_${tileNo}`);
    tile.addEventListener('click', () => {
        if(tile.classList.contains('activeTile')){
            tile.classList.toggle('activeTile');
            control.clearTiles.push(tileNo);

            if(tileNo === control.keyTile)
                tile.classList.toggle('keyTile');
            else
                tile.classList.toggle('clearTile');
            refreshActive();
        }
    })
}

// function clickActive(tile, tileNo){
//     if(tile.classList.contains('activeTile')){
//         tile.classList.toggle('activeTile');
//         control.clearTiles.push(tileNo);
//     }
//     if(tile.classList.contains(`tile_${control.keyTile}`)){
//         tile.classList.toggle('keyTile');
//     }else{
//         tile.classList.toggle('clearTile')
//     }
//     refreshActive();
// }