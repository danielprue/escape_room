let control = {
    emptyTiles: [],
    doorTile: -1,
    keyTile: -1,
    hasKey: false,
}

control.createRoom = function createRoom(){
    const room = document.createElement('div');
    room.classList.add('room');

    const tile_count = 9;
    randomizeLoot(tile_count);
    for(let i = 0; i < tile_count; i++){
        let tileClass = '';
        if(i === control.doorTile)
            tileClass = 'doorTile'
        else if(i === control.keyTile)
            tileClass = 'keyTile'
        else
            tileClass = 'emptyTile'
        room.append(createTile(tileClass))
    }

    document.querySelector('.game').append(room);
    return room;
}

function createTile(tileClass){
    const tile = document.createElement('div');
    tile.classList.add('tile', tileClass);

    return tile;
}

function randomizeLoot(roomSize){
    control.emptyTiles = [...Array(roomSize).keys()];
    control.doorTile = control.emptyTiles[Math.floor(Math.random()*control.emptyTiles.length)];
    removeTile(control.doorTile);
    control.keyTile = control.emptyTiles[Math.floor(Math.random()*control.emptyTiles.length)];
    removeTile(control.keyTile);
}

function removeTile(tileNo){
    let index = control.emptyTiles.indexOf(tileNo);
    if(index > -1)
        control.emptyTiles.splice(index, 1);
}