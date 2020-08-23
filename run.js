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

const WORLD_SHIFT = 0.5

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
    onBorder: false,
    on_ground(ground) {
        const y_next = this.y + this.dy
        next_bottom = y_next + this.height
        bottom = this.y + this.height
        left = this.x
        right = this.x + this.width
        
        if ((next_bottom >= ground.y) 
        && (bottom <= ground.y)
        && (right >= ground.x) 
        && (left <= ground.x + ground.width)) {
            this.y = ground.y - this.height
            this.dy = 0
            this.onGround = true
        } else {
            this.onGround = false;
        }
        return this.onGround
    },
    on_wall(wall) {
        const x_next = this.x + this.dx
        const y_next = this.y + this.dy
        const next_top = y_next
        const next_bottom = y_next + this.height
        const next_left = x_next
        const next_right = x_next + this.width
        const top = this.y
        const bottom = this.y + this.height
        const left = this.x
        const right = this.x + this.width
        const wall_top = wall.y
        const wall_bottom = wall.y + wall.height
        const wall_left = wall.x
        const wall_right = wall.x + wall.width
        
        console.log("y: ", this.y)
        console.log("dy: ", this.dy)

        console.log("top: ", top)
        console.log("next_top: ", next_top)
        console.log("bottom: ", bottom, next_bottom)
        console.log("wall y: ", wall.y)
        
        if ((next_right >= wall_left) 
        && (right <= wall_left)
        && ((bottom >= wall_top) || next_bottom >= wall_top)
        && ((top <= wall_bottom) || next_top <= wall_bottom)) {
            this.x = wall_left - this.width
            this.dx = 0
        } else 
        if ((top >= wall_bottom)
        && (next_top <= wall_bottom)
        && (right >= wall_left)
        && (left <= wall_right)) {
            this.y = wall_bottom
            this.dy = 0
        } else
        if ((next_left <= wall_right)
        && (left >= wall_right)
        && ((bottom >= wall_top) || next_bottom >= wall_top)
        && ((top <= wall_bottom) || next_top <= wall_bottom)) {
            this.x = wall_right
            this.dx = 0
        } else 
        if ((bottom <= wall_top)
        && (next_bottom >= wall_top)
        && (right >= wall_left)
        && (left <= wall_right)) {
            this.y = wall_top - this.height
            this.dy = 0
            this.onGround = true
        }
    },
    on_danger(danger) {
        if ((this.x + this.width >= danger.x) && (this.x <= danger.x + danger.width) 
        && (this.y + this.height >= danger.y) && (this.y <= danger.y + danger.height)) {
            this.onDanger = true
        } else {
            this.onDanger = false
        }
        return this.onDanger
    },
    on_border() {
        // canvas.width
        if (this.y + this.height > 400
        | this.x < 0 | this.x + this.width > 600) {
            this.onBorder = true
        } else {
            this.onBorder = false
        }
        return this.onBorder
    },
    update(grounds, dangers, walls) {
        let do_restart = false
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
        this.onGround = grounds.some(ground => this.on_ground(ground))

        // check if on wall
        walls.forEach(wall => this.on_wall(wall))
        // console.log(this.dx)
        this.x += this.dx
        this.y += this.dy

        // check if on danger space
        this.onDanger = dangers.some(danger => this.on_danger(danger))
        this.onBorder = this.on_border()
        if (this.onDanger == true || this.onBorder == true) {
            let do_restart = true
            return do_restart
        }
        return do_restart

        
    },
    draw() {
        drawRect(this.x, this.y, this.width, this.height, this.color)
    },
    start() {
        // this.x = ctx.canvas.width / 2 - this.width / 2;
        this.x = 100
        this.y = 250 - this.height;
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
// rectangle entity
class Block {
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
}
// walkable ground
class Ground {
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
class Danger {
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
}
// draw the board
function drawBoard(grounds, dangers, walls) {
    ctx.font = "24px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Run", canvas.width / 2, 20);
    // drawRect(1, 250, 600, 2, "blue")
    grounds.forEach(ground => ground.generate())
    dangers.forEach(danger => danger.generate())
    walls.forEach(wall => wall.generate())
    // ground1.generate()
    // ground2.generate()
    // ground3.generate()
    // ground4.generate()
    // ground5.generate()
    // ground6.generate()
    // bad1.generate("b1a")
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
// restart
function restart() {
    const ground1 = new Block(100, 250, 300, 2, "blue")
    const ground2 = new Block(300, 220, 40, 2, "blue")
    const ground3 = new Block(250, 180, 20, 2, "blue")
    const ground4 = new Block(300, 140, 40, 2, "blue")
    const ground5 = new Block(360, 100, 20, 2, "blue")
    const ground6 = new Block(520, 180, 60, 2, "blue")
    const ground7 = new Block(520, 340, 20, 2, "blue")
    const ground8 = new Block(620, 350, 40, 2, "blue")

    const danger1 = new Block(450, 250, 60, 150, "red")

    const wall1 = new Block(610, 110, 2, 160, "black")
    // const wall2 = new Block(200, 100, 50, 120, "black")


    const grounds = [ground1, ground2, ground3, ground4, ground5, ground6, ground7, ground8]
    const dangers = [danger1]
    const walls = [wall1]
    player.start()
    main(grounds, dangers, walls)
    // return grounds, dangers
}
// shift all items -1 x
function viewShift(player, grounds, dangers, walls) {
    function shift(entity) {
        entity.x -= WORLD_SHIFT
    }
    player.x -= WORLD_SHIFT
    grounds.map(ground => shift(ground))
    dangers.map(danger => shift(danger))
    walls.map(wall => shift(wall))
}
// The main game loop
function main(grounds, dangers, walls) {
    reset()
    viewShift(player, grounds, dangers, walls)

    drawBoard(grounds, dangers, walls)
    const do_restart = player.update(grounds, dangers, walls)
    if (do_restart) {
        return restart()
    }
    player.draw()

    requestAnimationFrame(() => main(grounds, dangers, walls))
    
}

restart()
// var w = window;
// requestAnimationFrame = w.requestAnimationFrame || 
// w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || 
// w.mozRequestAnimationFrame;

// player.start()
// main()
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