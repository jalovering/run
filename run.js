// Run
//TODO 
//fillstyle fix
//restart on mistake
//

// initialize canvas and keyboard
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
// var player;

// Handle keyboard controls
var keysDown = {};
// Check for keys pressed where key represents the keycode captured
addEventListener("keydown", function (key) {
keysDown[key.keyCode] = true;
}, false);
addEventListener("keyup", function (key) {
delete keysDown[key.keyCode];
}, false);
// create player
const player = {
    width: 20,
    height: 20,
    color: "black",
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    speedX: 0.5,
    speedY: -15,
    onGround: false,
    onDanger: false,
    on_ground(g) {
        const x_next = this.x + this.dx
        const y_next = this.y + this.dy
        // console.log(this.x)

        if ((y_next + this.height >= g.y) 
        && (this.y + this.height <= g.y)
        && (this.x + this.width >= g.x) 
        && (this.x <= g.x + g.width)) {
            this.y = g.y - this.height
            this.dy = 0
            this.onGround = true
        } else if ((this.y + this.height > g.y) 
        && (this.x + this.width >= g.x) 
        && (this.x <= g.x + g.width)) {
            this.onGround = false 
        } else {
            this.onGround = false;
        }
        return this.onGround
    },
    on_border() {
        // canvas.width
        if (this.y + this.height > 400
        | this.x < 0 | this.x + this.width > 600) {
            player.start()
        }
    },
    update() {
        this.on_border()
        if (37 in keysDown) { // Player is holding left key
            this.dx -= this.speedX;
        }
        if (39 in keysDown) { // Player is holding right key
            this.dx += this.speedX;
        }
        if (32 in keysDown && this.onGround) { // Player is holding spacebar
            this.dy = this.speedY
        }
        // apply gravity drag and move player
        this.dy += world.gravity 
        this.dy *= world.drag
        this.dx *= this.onGround ? world.groundDrag : world.drag
    
        // check if on ground
        this.onGround = grounds.some(g => this.on_ground(g))
        this.x += this.dx
        this.y += this.dy

        // check if on danger space
        if ((this.x + this.width >= bad1.x) && (this.x <= bad1.x + bad1.width) 
        && (this.y + this.height >= bad1.y) && (this.y <= bad1.y + bad1.height)) {
            onDanger = true
            player.start()
        }
    },
    draw() {
        drawRect(this.x, this.y, this.width, this.height, this.color)
    },
    start() {
        // this.x = ctx.canvas.width / 2 - this.width / 2;
        this.x = 100
        this.y = ground1.y - this.height;
        // this.y = 150
        this.onGround = true;
        this.dx = 0;
        this.dy = 0;
    }
}
// world rules
const world = {
    gravity: 0.99,
    drag: 0.9,
    groundDrag: 0.85,
    // ground: 250
}
// walkable ground
class ground {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    generate() {
        drawRect(this.x, this.y, this.width, this.height, this.color)
    }
    // getAll() {
    //     return this.allInstances
    // }
}
// dangerous areas
class danger_space {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }
    generate(name) {
        name = drawRect(this.x, this.y, this.width, this.height, this.color)
    }
}
// draw the board
function drawBoard() {
    ctx.font = "24px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Run", canvas.width / 2, 20);
    
    // drawRect(1, 250, 600, 2, "blue")
    ground1.generate()
    ground2.generate()
    ground3.generate()
    ground4.generate()
    ground5.generate()
    // ground6.generate()
    bad1.generate("b1a")
    // drawRect(0,0,10,10,"blue")
}
// draw rectangle with parameters
function drawRect(x, y, width, height, color) {
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fillStyle = color
    // ctx.fillRect(x, y, width, height);
    ctx.fill()
    ctx.closePath()
}
// Erase old state after update
function reset() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}
// The main game loop
function main() {
    reset()
    drawBoard()
    player.update()
    player.draw()
    console.log(player.onGround)
    requestAnimationFrame(main)
}

// var w = window;
// requestAnimationFrame = w.requestAnimationFrame || 
// w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || 
// w.mozRequestAnimationFrame;

// initialize()
bad1 = new danger_space(450, 250, 60, 150, "red")
ground1 = new ground(100, 250, 300, 2, "blue")
ground2 = new ground(200, 220, 100, 2, "blue")
ground3 = new ground(250, 180, 10, 2, "blue")
ground4 = new ground(300, 140, 10, 2, "blue")
ground5 = new ground(360, 100, 20, 2, "blue")
const grounds = [ground1, ground2, ground3, ground4, ground5]

player.start()
main()
// window.focus()




// // gravity
// function gravity(entity){
//     gravityValue = 0.05;
//     gravitySpeed = 0;
//     x = entity.x
//     y = entity.y
//     // function update(){    }
//     function newPos(){
//         gravitySpeed += gravityValue;
//         x = entity.x + entity.speedX
//         y = entity.y + entity.speedY + gravitySpeed
//     }
//     return x, y
// }