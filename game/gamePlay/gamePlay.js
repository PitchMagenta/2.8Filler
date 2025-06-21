
let wallCords = 6
let nav = false

let scale = {
  xMult: 1, 
  yMult: 0.9090900177208052, 
  zMult: 0.9999998437456502,
  floor: 0.5300,
  floorX: 0.5300,
  floorZ: 0.5300 + 0.028,
  xPlac: 12,
  yPlac: 2}

let globalShift = {
    x: 63,
    z: 65,
    y: 0
}

  const wallPlacment = ([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [0, 1, 1, 1, 1, 1, 0, 0, 1, 1], 
    [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1], 
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0], 
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1], 
    [1, 1, 0, 1, 0, 1, 1, 0, 0, 1], 
    [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1], 
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0], 
    [1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1], 
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0], 
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
]);

const FrogPlacment = ([
    //[1,1,0], 
    //[1,4,0], 
    //[2.5,9,0], 
    //[4,3,0],
    //[4.5,2.5,180],
    [4.5,6,0],
]);

const SCENE = document.querySelector('a-scene');
const FROGCOUNTER = document.querySelector('#frogCounter');
const TIMER = document.querySelector('#timer');
var frogs;
var gamePlaying = true;
var timer = 0
var frogCounter = 0

window.addEventListener('DOMContentLoaded', () => {
    createWalls(); 
    createPillers(); 
    createFloors(); 
    createFrogs(); 
    
    setupListeners();
    FROGCOUNTER.setAttribute('value', "Frogs: " + frogCounter + '/' + FrogPlacment.length);
    psedoDraw();
});

function psedoDraw() {
    setTimeout(() => {
        if (gamePlaying){
            timer++
            TIMER.setAttribute('value', "Time: " + Math.floor(timer/60) + ":" + timer % 60);
            psedoDraw();
        } 
    }, 1000);
}

function setupListeners() {
    frogs = SCENE.querySelectorAll('.clickable'); // update after frogs are created
    frogs.forEach(frog => {
        frog.addEventListener('click', FrogClicked, {
            passive: true,
            once: true,
        });
    });
}

function FrogClicked(evt) {
    var frog = evt.target
    frog.setAttribute('animation', {
        property: 'scale',
        to: '1, 0, 1',
        dur: 300,
        easing: 'easeInOutQuad',
    });
    setTimeout(() => {
        console.log("clicked ")
        SCENE.removeChild(frog);
        frog.destroy()
        frogCounter ++;
        FROGCOUNTER.setAttribute('value', "Frogs: " + frogCounter + '/' + FrogPlacment.length);
        if (frogCounter == FrogPlacment.length){
                gamePlaying = false
                gameOver(timer);
            }
    }, 300);
}

function createWalls(){
    for (let row = 0; row < wallPlacment.length; row++){
        for (let coloumn = 0; coloumn < wallPlacment[row].length; coloumn++ ){
            let rotationVal = 0;
            if ((row/2) % 1 == 0.5){
                rotationVal = 90;
            } 
            if (wallPlacment[row][coloumn] == 1){
                createWall((coloumn), (row), rotationVal)
            }
        }
    }
}

function createWall(xCord, zCord, rotationVal){
    if(!nav){
        const WALL = document.createElement('a-gltf-model');
        if (rotationVal == 0){
            WALL.setAttribute('position', `${xCord*scale.xPlac-globalShift.x} ${globalShift.y} ${zCord*scale.xPlac*0.5-globalShift.z}`);
        } else {
            WALL.setAttribute('position', `${(xCord-0.5)*scale.xPlac-globalShift.x} ${globalShift.y} ${zCord*scale.xPlac*0.5-globalShift.z}`);
        }
        WALL.setAttribute('src','#wall1');
        WALL.setAttribute('scale', `${scale.xMult} ${scale.yMult} ${scale.zMult}`);
        WALL.setAttribute('rotation', `0 ${rotationVal}  0`);
        SCENE.appendChild(WALL);
    } else {
        const BLOCK = document.createElement('a-entity');
        if (rotationVal == 0){
            BLOCK.setAttribute('position', `${xCord*scale.xPlac-globalShift.x} ${globalShift.y + 6} ${zCord*scale.xPlac*0.5-globalShift.z}`);
        } else {
            BLOCK.setAttribute('position', `${(xCord-0.5)*scale.xPlac-globalShift.x} ${globalShift.y + 6} ${zCord*scale.xPlac*0.5-globalShift.z }`);
        }
        
        BLOCK.setAttribute('geometry',"primitive: box; width: 14.1; height: 12; depth: 3;");
        BLOCK.setAttribute('rotation', `0 ${rotationVal}  0`);
        SCENE.appendChild(BLOCK);
    }
}

function createPillers(){
    for (let row = 0; row < (wallPlacment.length + 1)/2; row++){
        console.log("Max Row :  " + (wallPlacment.length + 1)/2)
        for (let coloumn = 0; coloumn < wallPlacment[0].length + 1; coloumn++ ){
            createPiller(coloumn, row);
        }
    }
}
function createPiller(xCord, zCord){
    if(!nav){
        const PILLER = document.createElement('a-gltf-model');
        PILLER.setAttribute('position', `${(xCord - 0.5)*scale.xPlac-globalShift.x} ${globalShift.y} ${zCord*scale.xPlac-globalShift.z}`);
        PILLER.setAttribute('src','#piller');
        PILLER.setAttribute('scale', `${scale.xMult} ${scale.yMult} ${scale.zMult}`);
        SCENE.appendChild(PILLER);
    } 
}

function createFloors(){
    if (!nav){
        for (let row = 0; row < (wallPlacment.length + 1)/2; row++){
            console.log("Max Row :  " + (wallPlacment.length + 1)/2)
            for (let coloumn = 0; coloumn < wallPlacment[0].length + 1; coloumn++ ){
                createFloor(coloumn, row);
            }
        }
    } else {
        const FLOOR = document.createElement('a-entity');
        FLOOR.setAttribute('geometry',"primitive: plane; width: 115; height: 74;");
        FLOOR.setAttribute('rotation', '-90 0 0'); 
        FLOOR.setAttribute('position', '0 0 -30'); 

        SCENE.appendChild(FLOOR);

    }
}
function createFloor(xCord, zCord){
    const FLOOR = document.createElement('a-gltf-model');
    FLOOR.setAttribute('position', `${(xCord)*scale.xPlac-globalShift.x} ${globalShift.y} ${(zCord - 0.5)*scale.xPlac-globalShift.z}`);
    FLOOR.setAttribute('src','#floor');
    FLOOR.setAttribute('scale', `${scale.floorX} ${scale.floor} ${scale.floorZ}`);
    SCENE.appendChild(FLOOR);
}

function createFrogs(){
    for (let i = 0; i <FrogPlacment.length; i++){
        createFrog(FrogPlacment[i][1], FrogPlacment[i][0], FrogPlacment[i][2]-180)
    }
}

function createFrog(xCord, zCord, rotationVal){
    if(!nav){
        const FROG = document.createElement('a-gltf-model');
        FROG.setAttribute('gltf-model', '#frog');
        FROG.setAttribute('position', `${(xCord - 0.5)*scale.xPlac-globalShift.x} ${0} ${zCord*scale.xPlac-globalShift.z}`);
        FROG.setAttribute('rotation', `0 ${rotationVal}  0`);
        FROG.setAttribute('scale','1 1 1');
        FROG.setAttribute('class', 'clickable')
        SCENE.appendChild(FROG);
    }
}

function gameOver(timer){
    localStorage.setItem("currentScore", timer);
    console.log(JSON.parse(localStorage.getItem("currentScore")));
    setTimeout(() => {
        window.location.href = "../gameOver/gameOver.html"
    }, 300);

}


//const model = document.querySelector('#wallingaway');
//
//model.addEventListener('model-loaded', () => {
//  const mesh = model.getObject3D('mesh');
//  if (!mesh) return;
//
//  const box = new THREE.Box3().setFromObject(mesh);
//  const size = new THREE.Vector3();
//  box.getSize(size);
//
//  console.log('Model size:', size); // size.x, size.y, size.z
//  console.log(13 / size.x)
//  console.log(2 / size.y)
//});