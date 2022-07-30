var canvas = document.getElementById("untitledCanvas"); //Draw game on the canvas, assumed to be big enough for 12 by 8 tiles
var ctx = canvas.getContext("2d"); //I considered 3D, maybe have each tile be one of those boxes like on the games page? Might do that a different time

//List of colors used for the radial gradients that fill each tile. Stored in order of filament -> diffuse -> shadow
const gradPal = [
    ['#ff6e28', '#fd1d1d', '#7d0000'], //red (player) 0
    ['#b7ff28', '#42fd1d', '#007d08'], //green (slime) 1
    ['#28c0ff', '#1d95fd', '#001e7d'], //blue (flying) 2
    ['#ff7fd2', '#fd1db6', '#7d007a'], //pink (eye) 3
    ['#ffea28', '#fda11d', '#7d1b00'], //orange (spring) 4
    ['#ffffff', '#aaaaaa', '#555555'], //white (bricks) 5
    ['#fcff94', '#fff100', '#7d4c00'], //yellow (coin) 6
    ['#d458ff', '#9500ff', '#30007d'], //purple (boxes) 7
    ['#878787', '#3c3c3c', '#000000'], //gray (spike) 8
    ['#f1c4ff', '#ca75ff', '#5200a2'], //violet (angry) 9
    ['#000000', '#000000', '#000000'], //Off 10
]
//Tiles: 0=Blank, 1-8=Player, 9=Brick, 10=Spike, 11=Box, 12=Coin, 13=Spring, 14=Exit, 15=Logo, 16-19=Eye, 20-21=Angry, 22-23=Flying, 24=Dead, 25=SlimePipe, 26-27=Slime, 28=Camera
const tilePal = [10, 0, 0, 0, 0, 0, 0, 0, 0, 5, 8, 7, 6, 4, 1, 2, 3, 3, 3, 3, 9, 9, 2, 2, 0, 1, 1, 1, 5, 5, 5];

const level1 = [
[ 0,20, 9, 0, 0, 0, 0, 9],
[ 0, 0, 9, 0, 0, 0, 0, 9],
[ 0, 0, 9, 0, 0, 0, 0, 9],
[ 0, 0, 9, 0, 0, 0, 9, 9],
[ 0, 0, 9, 0, 0,12, 9, 9],
[ 0, 0, 9, 0, 0, 0, 0, 9],
[ 0, 0, 9, 0, 0, 9, 0, 9],
[ 0, 0, 9, 0,12, 9, 0, 9],
[ 0, 0, 0, 0, 0, 9, 0, 9],
[ 0, 0, 0, 0, 0, 0, 0, 9],
[ 0, 0, 0, 0, 0, 0, 0, 9],
[ 0, 0, 0, 0, 0, 9, 9, 9],
[ 0, 0, 0, 0,12, 9, 9, 9],
[ 0, 0, 0, 0, 0, 9, 9, 9],
[ 0, 0, 0, 0, 0, 9, 9, 9],
[ 0, 0, 0, 0,12, 9, 9, 9],
[ 0, 0, 0,12, 0, 0, 0,10],
[ 0, 0, 0,12, 0, 0, 0,10],
[ 0, 0, 0, 0,12, 9, 9, 9],
[ 0, 0, 0, 0, 0, 9, 9, 9],
[ 0, 0, 0, 0, 9, 9, 9, 9],
[ 0, 0, 0, 9, 9, 9, 9, 9],
[ 0, 0, 0, 9, 9, 9, 9, 9],
[ 0, 0, 0, 0, 0, 0, 0, 9],
[ 9, 9, 9, 9, 9, 0, 0, 9],
[ 0, 0, 0, 0, 9, 0, 0, 9],
[ 0, 0, 0, 0, 9, 0, 0, 9],
[ 0, 0, 0, 0, 0, 0,13, 9],
[ 0, 0, 0, 9, 0, 0, 0, 9],
[ 0, 0, 0, 9, 0, 0, 0, 9],
[ 0, 0, 0, 9, 9, 9, 9, 9],
[ 0, 0, 0, 9, 0, 0, 0, 9],
[ 0, 0, 0, 9, 0,12, 0, 9],
[ 0, 0, 0, 9, 0, 0, 0, 9],
[ 0, 0, 0, 0, 0, 0, 9, 9],
[ 0, 0, 0, 0, 0, 9, 9, 9],
[ 0, 0, 0, 0, 0, 0,10, 9],
[ 0, 0, 0, 0, 9, 0,10, 9],
[ 0, 0, 0, 0, 9, 0,10, 9],
[ 0, 0, 0, 0, 0, 0,10, 9],
[ 0, 0, 0, 0, 9, 9, 9, 9],
[ 0, 0, 0, 0, 9, 9, 9, 9],
[ 0, 0, 0, 0, 9, 9, 9, 9],
[ 9, 9, 9,11, 9, 9, 9, 9],
[ 9, 0, 0, 0, 0,10, 9, 9],
[ 9, 0, 0, 9, 9, 9, 9, 9],
[ 9, 0, 0, 9, 9, 9, 9, 9],
[ 9, 0, 0, 9, 9, 9, 9, 9],
[ 9, 0, 0, 0, 0,13, 9, 9],
[ 9, 0,12, 0, 0, 9, 9, 9],
[ 9, 0,12, 0, 0, 9, 9, 9],
[ 9, 0,12, 0,20, 9, 9, 9],
[ 9, 0,12, 0, 0, 9, 9, 9],
[ 9, 0, 0, 0, 0, 9, 9, 9],
[ 9, 0, 0, 9, 9, 9, 9, 9],
[ 9, 0, 0, 9, 9, 9, 9, 9],
[ 9, 0, 0, 0, 0,13, 9, 9],
[ 9, 0,12, 0, 0, 9, 9, 9],
[ 9, 0,12, 0, 0, 9, 9, 9],
[ 9, 0,12,20,20, 9, 9, 9],
[ 9, 0,12, 0, 0, 9, 9, 9],
[ 9, 0, 0, 0, 0, 9, 9, 9],
[ 9, 0, 0, 9, 9, 9, 9, 9],];

const sprSheet = new Image(); //Silhouettes for each character/tile
sprSheet.src = 'players/javascript/untitledport/ut.png'; //URL is very relative, might be a better way?

class DrawTile { //Each of the tiles which are rendered and shown to the player are Draw Tiles.
    constructor(x, y) { //Each one has these three values:
        this.color = 0; //The current color it should be,
        this.tile = 0; //The current tile it should be,
        this.dark = 0; //How dark should it be
        this.x = x;
        this.y = y;
    }

    Draw() {
        //The upper-left corner of the current tile
        var tx=this.x*32;
        var ty=this.y*32;

        //The center of the current tile
        var cx=tx+16;
        var cy=ty+16;

        var t= this.tile;
        var tc = this.color;

        var gradient = ctx.createRadialGradient(cx,cy,2,cx,cy,16); //Create a radial gradient starting from the center of the tile
        gradient.addColorStop(0, gradPal[tc][0]); //Put the lightest color in the very center
        gradient.addColorStop(0.5, gradPal[tc][1]); //Then the diffuse color
        gradient.addColorStop(1, gradPal[tc][2]); //Then the shadow color on the outside
        ctx.fillStyle = gradient; //Use that gradient to fill the background
        ctx.fillRect(tx, ty, 32, 32); //Fill the background rectangle

        ctx.fillStyle = 'rgba(0,0,0,'+this.dark+')'; //Dimming Color
        ctx.fillRect(tx, ty, 32, 32); //Dim the light as needed

        ctx.drawImage(sprSheet, t*64, 0, 64, 64, tx, ty, 32, 32); //Draw the stencil of the tile over the gradient background
    }

    Update() {
        var newTile = getTile(this.x + cam.x, this.y + cam.y);
        this.tile = newTile;
        var newColor = tilePal[this.tile];
        if (newColor != this.color) {
            this.color = newColor;
            this.dark = 1.0;
            return true;
        }
        if (this.dark >= 0) {
            this.dark -= 0.1;
        }
        return false;
    }
}

class Player { //Object to store all the info for the player
    constructor() { //Each one has these three values:
        this.x = 1; //X (Horizontal, left to right)
        this.y = 6; //Y (Vertical, top to bottom)
        this.f = 1; //Current frame of animation
        this.cm = false; //Camera mode
    }
}

class Camera { //Object to store all the info for the camera
    constructor() {
        this.x = -1; //X (Horizontal, left to right)
        this.y = -1; //Y (Vertical, top to bottom)
    }
}

var viewPort = new Array(12);
for (let x=0; x<12; x++) {
    viewPort[x] = new Array(8);
    for (let y=0; y<8; y++) {
        viewPort[x][y] = new DrawTile(x, y);
    }
}

var player = new Player();
var cam = new Camera();

function draw(progress) { //Called repeatedly to update the player's view.
    for (let x = 0; x < 12; x++) { //For all 12 columns visible to the player
        for (let y = 0; y < 8; y++) { //For all 8 tiles in each column
            viewPort[x][y].Draw();
        }
    }
}

function update(progress) {
    var hUpd = false;
    for (let x = 0; x < 12; x++) { //For all 12 columns visible to the player
        for (let y = 0; y < 8; y++) { //For all 8 tiles in each column
            var tUpd = viewPort[x][y].Update();
            if (tUpd) {
                hUpd = true;
            }
        }
    }
    if (hUpd) {
        var audio = new Audio('players/javascript/untitledport/Click.wav');
        audio.play();
    }
}

function getTile(x, y) {
    if (player.cm && x==cam.x && y==cam.y) {
        return 28;
    } else if (player.x == x && player.y == y) {
        return player.f; //Always show the player wherever they are
    } else if (x==-2 && y==6) {
        return 15; //Special logo tile secret off the side of the screen
    } else if (x < 0) {
        return 9; //Anything off the left edge of the map is brick
    } else if (x >= level1.length) {
        return 9; //Anything off the right edge of the map is brick
    } else if (y >= level1[x].length) {
        return 9; //Anything below the floor is brick
    } else if (y < 0) {
        if (getTile(x,0)==9) {
            return 9; //If there's a brick tile right by the top of the level, extend it upward infinitely
        }
        return 0; //Otherwise, there should be an infinite empty void extending upward above the level
    }
    return level1[x][y]; //If it's a perfectly reasonable position inside the map, just return whatever's supposed to be there
}

function progress() { //Called every time the player presses a button to move (or wait)

}

function mainloop(timestamp) { //Called repeatedly, forever
    var progress = timestamp - lastRender; //Get the delta time between this frame and the last

    draw(progress); //draw
    update(progress); //update each tile

    lastRender = timestamp; //Update this so we can calculate delta time again next frame
    window.requestAnimationFrame(mainloop); //Please call this function again next time we wanna update
}

onkeydown = (event) => {
    var code = event.code;
    switch (code) {
        case "KeyW":
        case "ArrowUp":
        case "Numpad8":
            if (player.cm) {
                cam.y--;
            } else {
                player.y--;
            }
            break;
        case "KeyA":
        case "ArrowLeft":
        case "Numpad4":
            if (player.cm) {
                cam.x--;
            } else {
                player.x--;
            }
            break;
        case "KeyS":
        case "ArrowDown":
        case "Numpad2":
            if (player.cm) {
                cam.y++;
            } else {
                player.y++;
            }
            break;
        case "KeyD":
        case "ArrowRight":
        case "Numpad6":
            if (player.cm) {
                cam.x++;
            } else {
                player.x++;
            }
            break;
        case "KeyL":
        case "KeyZ":
            player.cm=!player.cm;
            break;
        case "KeyK":
        case "KeyX":
            break;
    }
};

var lastRender = 0; //Starting time
window.requestAnimationFrame(mainloop); //Please start the main loop