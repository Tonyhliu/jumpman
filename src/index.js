//code will be validated more strictly - can't have undeclared var's ect
"use strict" 

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: undefined,
    y: undefined
}
const keys = [];
const gravity = 1;
const friction = 1;

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    init()
})

addEventListener('click', () => {
    init();
})

addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
});

addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
});


// Objects
class Ball {
    constructor(x, y, dy, dx, radius, color) {
        this.x = x
        this.y = y;
        this.velocity = {
            x: dx,
            y: dy
        }
        this.radius = radius
        this.color = color;
        this.mass = 1;
        this.isJumping = false;
        this.isFalling = false;
        this.jumpSpeed = 0;
        this.gravity = 0;
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill();
        c.stroke();
        c.closePath();
    }

    update() {
        if (this.y + this.radius > canvas.height) {
            this.velocity.y = -this.velocity.y * friction;
        } else {
            this.velocity.y += gravity;
        }
        this.y += this.velocity.y
        // this.x += this.dx;
        this.draw()
    }

}

 function wrap(x, max) {
     console.log(max);
    if (x < 0) {
    return max - (x % max);
    } else if (x > max) {
    return x % max;
    } else {
    return x;
    }
}

class MovingBall extends Ball {
    constructor(x, y, dy, dx, radius, color) {
        super(x, y, dy, dx, radius, color);
    }

    bounce () {
        // console.log('jump')
        if (!this.isJumping && !this.isFalling) {
            console.log('bounce');
            this.gravity = 0;
            this.jumpSpeed = 27;
            this.isJumping = true;
        }
    }

    checkJump () {
        // if ball is below canvas height, jump normal, else move platform up
        if (this.y > canvas.height * 0.2) {
            this.y -= this.jumpSpeed;
        } else {
            platforms.forEach((platform) => {
                platform.y += this.jumpSpeed;
                // if platform is above canvas height, generate a new one
                if (platform.y > canvas.height) {
                    platform.x = Math.random() * (canvas.width - platformWidth);
                    platform.y = platform.y - canvas.height;
                }
            })
        }
        this.jumpSpeed -= 1;
        if (this.jumpSpeed == 0) {
            this.isJumping = false;
            this.isFalling = true;
            this.gravity = 1;
        }
    }

    checkFall () {
        if (this.y < canvas.height - this.radius) {
            this.y += this.gravity;
            this.gravity += 1;
        } else {
             this.fallStop();
        }
    }

    fallStop () {
        // console.log('stopfall')
        this.isFalling = false;
        this.gravity = 0;
        this.bounce();
    }

    update() {
               //start the bounce
               this.bounce();
               
               //check the balls status
               if (this.isJumping) this.checkJump();
               if (this.isFalling) this.checkFall();

               //check every frame to see if the ball collides with a platform
               checkCollision(ball2);

               // mouse movement
               // this.x + this.radius < mouse.x;
               //this.x - this.radius > mouse.x ||
               if (keys[68] || keys[39]) {
                 this.velocity.x = 10;
               } else if (keys[65] || keys[37]) {
                 this.velocity.x = -10;
               } else {
                 this.velocity.x = 0;
               }
               
               if (this.x < 0 || this.x > canvas.width) {
                   this.x = wrap(this.x, canvas.width);
               }
               this.x += this.velocity.x;
               this.draw();
             }
}


// Implementation
let ball;
let ball2;

// initialize balls
function init() {
    ball = new Ball(canvas.width / 2, canvas.height / 2, 3, 2, 30, colors[3]);
    ball2 = new MovingBall(canvas.width / 3, canvas.height / 2, 3, 2, 30, colors[2]);
    generatePlatforms();

}

// get distance between 2 points + pow
const getDistance = (x1, y1, x2, y2) => {
    let xDist = x2 - x1;
    let yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}


// Set background
function setBackground() {
    c.fillStyle = "#d0e7f9";
    c.beginPath();
    c.rect(0, 0, canvas.width, canvas.height);
    c.closePath();
    c.fill();
}


let numOfPlatforms = 11;
let platforms = [];
let platformWidth = 100;
let platformHeight = 20;

class Platform {
    constructor (x, y) {
        this.x = Math.floor(x);
        this.y = y;
    }
    
    onCollide (ball) {
        console.log('collide');
        ball.fallStop();
    }

    draw () {
        c.fillStyle = "#a57d50";
        c.fillRect(this.x, this.y, platformWidth, platformHeight);
    };

};
 //  400 < x < 480 &&    200 < y < 250
const checkCollision = (object) => {
    platforms.forEach(platform => {
        if ((object.isFalling) && (object.x <= platform.x + platformWidth)
            && (object.x >= platform.x)
            && (object.y + object.radius >= platform.y)
            && (object.y + object.radius <= platform.y + platformHeight)) {
                platform.onCollide(object);
            }
    })
}


const generatePlatforms = () => {
  let position = 0;
  for (let i = 0; i < numOfPlatforms; i++) {
    
    platforms[i] = new Platform(
      Math.random() * (canvas.width - platformWidth),
      position, 
    );
    
    if (position < canvas.height - platformHeight)
      position += Math.floor((canvas.height / numOfPlatforms));
  }
  //and Y position interval
};





function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    
    setBackground();
    
    //x,y coords on mouse
    c.fillStyle = 'black';
    c.fillText(`${mouse.x}, ${mouse.y}`, mouse.x, mouse.y);
        
    platforms.forEach((platform) => { platform.draw(c); });

    // DrawCircles();
    ball.update();
    
    ball2.update();
    if (getDistance(ball.x, ball.y, ball2.x, ball2.y) < ball.radius + ball2.radius) {
        // console.log('Collide!')
    }

}

function gameStart() {
    init()
    animate()
}

gameStart();


//testing
window.ball = ball;
window.ball2 = ball2;
window.platforms = platforms;