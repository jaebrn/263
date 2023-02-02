var phase = 1; // scene manager
// phase 0 == main sequence, phase 1 == supernova,  phase 3 == black hole
var totalMass = 0; // total particle mass (determines end state)
var supernovaCount = 500;

var smallParticles = []; // array containing small particles
var medParticles = []; // array containing medium particles
var largeParticles = [];//array containing large particles
var supernovaArray = []; // array containing supernova particles


function setup() {
    createCanvas(1800, 1800);
    background(0); // black background

    for (let i = 0; i < 20; i++) { // opens with 100 small particles
        smallParticles[i] = new SmallParticle; // array instantiation
    }
    for (let i = 0; i < supernovaCount; i++) {
        supernovaArray[i] = new Supernova;
        supernovaArray[i].setup();
    }
}

function draw() {
    // draw function continuously calculates total mass
    // other than that, draw() just directs to the appropriate phase
    totalMass = smallParticles.length + medParticles.length * 2 + largeParticles.length * 4;
    // small particle mass = 1; medium = 1*2 (2); large = 2*2 (4)
    //print(totalMass);

    switch (phase) {
        case 0:
            mainSequence();
            break;
        case 1:
            supernova();
            break;
        case 2:
            blackHole();
            break;
        default:
            mainSequence();
            break;
    }
}

function mainSequence() {
    // primary phase of the simulation in which the fusion mass particles collide with each other
    background(0) //black background

    //handling small particles
    for (let i = 0; i < smallParticles.length; i++) {
        smallParticles[i].display();
        smallParticles[i].move();
        //small particle collision handling:
        for (let j = 0; j < smallParticles.length; j++) {
            var d = dist(smallParticles[j].pos.x, smallParticles[j].pos.y, smallParticles[i].pos.x, smallParticles[i].pos.y)
            //print(d);
            if (d <= smallParticles[i].radius * 2 && i != j) {
                print('collided');
                // background(255, 0, 0);
                medParticles.push(new MedParticle(smallParticles[i].pos.x, smallParticles[i].pos.y));
                smallParticles.splice(i, 1);
                smallParticles.splice(j, 1);
                break;
            }
        }
    }

    //handling medium particles
    for (let i = 0; i < medParticles.length; i++) {
        medParticles[i].display();
        medParticles[i].move();
        for (let j = 0; j < medParticles.length; j++) {
            var d = dist(medParticles[j].pos.x, medParticles[j].pos.y, medParticles[i].pos.x, medParticles[i].pos.y)
            //print(d);
            if (d <= medParticles[i].radius * 2 && i != j) {
                print('collided');
                // background(255, 0, 0);

                largeParticles.push(new LargeParticle(medParticles[i].pos.x, medParticles[i].pos.y));
                medParticles.splice(i, 1);
                medParticles.splice(j, 1);
                break;
            }
        }
    }

    //handling large particles
    for (let i = 0; i < largeParticles.length; i++) {
        largeParticles[i].display();
        largeParticles[i].move();
    }

    if (keyIsDown(32) && frameCount % 3 == 1) { // allows user to inject additional mass (slowed by framecount condition)
        smallParticles.push(new SmallParticle); // adds small particle to array
    }

    //print('number of medium particles' + medParticles.length);
}

function supernova() {
    background(0);
    for (let i = 0; i < supernovaCount; i++) {
        supernovaArray[i].display();
        supernovaArray[i].move();
    }
}


function blackHole() {

}

class SmallParticle {
    constructor() {
        this.pos = {
            x: random(width),
            y: random(height)
        }
        this.speed = {
            x: random(1, 2),
            y: random(1, 2)
        } // speed 
        this.velocity = {
            x: random(-1, 1),
            y: random(-1, 1)
        }; // velocity
        this.size = 15; // particle size
        this.radius = 10
        this.color = color(236, 157, 237, 200);
    }

    display() {
        noStroke();
        fill(this.color); // white particles
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draws particle
    }

    move() {
        this.pos.x += this.speed.x * this.velocity.x; // handles x movement
        this.pos.y += this.speed.y * this.velocity.y; // handles y movement

        //particles bounce off of screen bounds
        if (this.pos.x <= 1 || this.pos.x >= width - 1) {
            this.velocity.x *= -1;
        } else if (this.pos.y <= 1 || this.pos.y >= height - 1) {
            this.velocity.y *= -1;
        }
    }

}

class MedParticle {
    constructor(x, y) {
        this.pos = {
            x, y
        }
        this.speed = {
            x: random(1, 2),
            y: random(1, 2)
        } // speed 
        this.velocity = {
            x: random(-1, 1),
            y: random(-1, 1)
        }; // velocity
        this.radius = 20
        this.color = color(200, 128, 183, 200);
    }

    display() {
        noStroke();
        fill(this.color); // white particles
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draws particle
    }

    move() {
        this.pos.x += this.speed.x * this.velocity.x; // handles x movement
        this.pos.y += this.speed.y * this.velocity.y; // handles y movement

        //particles bounce off of screen bounds
        if (this.pos.x <= 1 || this.pos.x >= width - 1) {
            this.velocity.x *= -1;
        } else if (this.pos.y <= 1 || this.pos.y >= height - 1) {
            this.velocity.y *= -1;
        }
    }

}

class LargeParticle {

    constructor(x, y) {
        this.pos = {
            x, y
        }
        this.speed = {
            x: random(1, 2),
            y: random(1, 2)
        } // speed 
        this.velocity = {
            x: random(-1, 1),
            y: random(-1, 1)
        }; // velocity
        this.radius = 40
        this.color = color(159, 107, 160, 200);
    }

    display() {
        noStroke();
        fill(this.color); // white particles
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draws particle
    }

    move() {
        this.pos.x += this.speed.x * this.velocity.x; // handles x movement
        this.pos.y += this.speed.y * this.velocity.y; // handles y movement

        //particles bounce off of screen bounds
        if (this.pos.x <= 1 || this.pos.x >= width - 1) {
            this.velocity.x *= -1;
        } else if (this.pos.y <= 1 || this.pos.y >= height - 1) {
            this.velocity.y *= -1;
        }
    }

}

class Supernova {
    constructor() {
        this.pos = {
            x: width / 2,
            y: height / 2
        }
        this.velocity = {
            x: random(-1, 1),
            y: random(-1, 1)
        }
        this.size = random(5, 250);
        this.color = color(random(255), random(255), random(255), random(255));
        this.speed = 3;
        this.distanceSeed = random(-50, 150);
    }

    setup() {
        if (this.velocity >= 0 && this.velocity < 0.45) {
            this.velocity = 0.45;
        } else if (this.velocity < 0 && this.velocity > -0.45) {
            this.velocity = -0.45;
        }
    }

    display() {
        noStroke();
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.size);
    }

    move() {
        if (dist(this.pos.x, this.pos.y, width / 2, height / 2) <= 500 + this.distanceSeed) {
            this.pos.x += this.velocity.x * this.speed;
            this.pos.y += this.velocity.y * this.speed;
        }
    }

}