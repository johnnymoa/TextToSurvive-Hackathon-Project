const CELL_SIZE = 50;
let GRID_COLS = 0;
let GRID_ROWS = 0;
let grid = [];

let gameState;

let baseMapImg;
let girlfriendImg;
let clownImg;

let isSoundOn = localStorage.getItem("isSoundOn") === null ? true : localStorage.getItem("isSoundOn") !== "false";
const soundIcon = document.getElementById("soundIcon");
const bgMusic = document.getElementById("bgMusic");

const mistralAPI = new MistralAPI();

let chatMessages = [];

function setup() {
    baseMapImg = loadImage('/assets/img/appartment/baseMap.PNG');
    girlfriendImg = loadImage('/assets/img/gf.png');
    clownImg = loadImage('/assets/img/clown.png');

    gameState = new GameState({
        ...getApt(),
        grid: getGrid(),
        furniture:getFurniture()
    });

    GRID_COLS = gameState.map_data.gridCols;
    GRID_ROWS = gameState.map_data.gridRows;

    girlfriend = new Girlfriend(gameState, girlfriendImg);
    clown = new Clown(gameState, clownImg);

    // Once loaded, initialize the P5 canvas with correct dims
    let canvas = createCanvas(GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE);
    canvas.parent('mapWrapper');
    adjustScale();
}

function draw() {

    if (baseMapImg) {
        image(baseMapImg, 0, 0, GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE);
    }
    // drawGrid();
    // drawWallsAndDoors();

    drawLabels(gameState.map_data.rooms);

    if (girlfriend) {
        girlfriend.drawPath(CELL_SIZE);
        girlfriend.draw(CELL_SIZE);
    }
    if (clown) {
        clown.checkForGirlfriend(girlfriend);
        clown.drawPath(CELL_SIZE);
        clown.draw(CELL_SIZE);
    }
}