const CELL_SIZE = 50;
let GRID_COLS = 0;
let GRID_ROWS = 0;
let grid = [];

let gameState;
let girlfriend;
let clown;

let baseMapImg; 
let girlfriendImg;
let clownImg;

let isSoundOn = localStorage.getItem("isSoundOn") === null ? true : localStorage.getItem("isSoundOn") !== "false";
const soundIcon = document.getElementById("soundIcon");
const bgMusic = document.getElementById("bgMusic");

const mistralAPI = new MistralAPI();
let chatMessages = []; 

async function loadAptJson() {
        baseMapImg = loadImage('/assets/img/appartment/baseMap.PNG');
        girlfriendImg = loadImage('/assets/img/gf.png');
        clownImg = loadImage('/assets/img/clown.png');

        const response = await fetch('/static/game/apt.json');
        const data = await response.json();

        GRID_COLS = data.gridCols || 40;
        GRID_ROWS = data.gridRows || 20;
        grid = data.grid || [];

        for (let y = 0; y < GRID_ROWS; y++) {
            for (let x = 0; x < GRID_COLS; x++) {
                if (!grid[y]) grid[y] = [];
                if (!grid[y][x]) {
                    grid[y][x] = { type: 'empty', color: null };
                } else if (typeof grid[y][x] === 'string') {
                    grid[y][x] = { type: grid[y][x], color: null };
                }
            }
        }


        gameState = new GameState(data);
        girlfriend = new Girlfriend(gameState, girlfriendImg);
        clown = new Clown(gameState, clownImg);


        // Once loaded, initialize the P5 canvas with correct dims
        let canvas = createCanvas(GRID_COLS * CELL_SIZE, GRID_ROWS * CELL_SIZE);
        canvas.parent('mapWrapper');
        adjustScale();
}

function setup() {
    loadAptJson();
}

function draw() {
    if (!grid || grid.length === 0) {
        return;
    }
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




