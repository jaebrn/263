var phase = 0; // scene manager
// phase 0 == main sequence, phase 1 == supernova,  phase 3 == black hole

var totalMass = 0; // total particle mass
var threshold = 20; // threshold mass (when mass = this, particles undergo crush)
var crush = false; // when true, triggers the fusion mass particles to collapse
var center; // center of screen

var smallParticles = []; // array containing small particles
var medParticles = []; // array containing medium particles
var largeParticles = [];//array containing large particles

var fusionEnergy = []; // array for the particle system active upon fusion
var fusionConst = 14; // constant multiplier for length of particle array (length depends on particle type)

var supernovaCount = 3000; // number of supernova particles
var supernovaArray = []; // array containing supernova particles

var spot; // black hole 

function setup() {
    createCanvas(1800, 1800);
    background(0); // black background
    center = createVector(width / 2, height / 2);

    for (let i = 0; i < 20; i++) { // opens with 100 small particles
        smallParticles[i] = new SmallParticle; // array instantiation
    }
    for (let i = 0; i < supernovaCount; i++) { // prepares supernova particles without spawning them
        supernovaArray[i] = new Supernova;
        supernovaArray[i].setup();
    }

    spot = new BlackHole; // instantiating black hole
}

function draw() {
    // draw function continuously calculates total mass
    // other than that, draw() just directs to the appropriate phase

    totalMass = smallParticles.length + medParticles.length * 2 + largeParticles.length * 4;
    // small particle mass = 1; medium = 1*2 (2); large = 2*2 (4)

    //print(totalMass);
    //print(phase);

    switch (phase) { // scene management
        case 0: // main sequence: particles float and fuse
            mainSequence();
            break;
        case 1: // supernova expanse phase
            setInterval(phase3, 10000);
            supernova();
            break;
        case 2: // black hole phase
            supernova();
            blackHole();
            break;
    }
}

function mainSequence() {
    if (crush != true) {
        // initial phase of the simulation in which the fusion mass particles collide with each other
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
                    medParticles.push(new MedParticle(smallParticles[i].pos.x, smallParticles[i].pos.y));
                    fusionEnergy.push(new FusionEnergy(smallParticles[i].pos.x, smallParticles[i].pos.y));
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
                    largeParticles.push(new LargeParticle(medParticles[i].pos.x, medParticles[i].pos.y));
                    fusionEnergy.push(new FusionEnergy(medParticles[i].pos.x, medParticles[i].pos.y));
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

        if (totalMass >= threshold && largeParticles.length > smallParticles.length) {
            crush = true; // triggers phase 1.5
            // phase 1.5 in which fusion mass particles collect in center
        }
    }

    if (crush == true) {
        background(0, 0, 0, 10);
        setInterval(phase2, 5000);
        for (let i = 0; i < smallParticles.length; i++) {
            smallParticles[i].display();
            smallParticles[i].move();
        } for (let i = 0; i < medParticles.length; i++) {
            medParticles[i].display();
            medParticles[i].move();
        } for (let i = 0; i < largeParticles.length; i++) {
            largeParticles[i].display();
            largeParticles[i].move();
        }
    }

    if ((keyIsDown(32) || keyIsDown(13) || mouseIsPressed) && frameCount % 3 == 1) { // allows user to inject additional mass (slowed by framecount condition)
        smallParticles.push(new SmallParticle); // adds small particle to array
    }
    // handling fusion energy array
    for (i = 0; i < fusionEnergy.length; i++) {
        fusionEnergy[i].display();
        fusionEnergy[i].grow();
        if (fusionEnergy[i].counter >= 15) {
            fusionEnergy.splice(i, 1);
        }
    }
}

function supernova() {
    if (phase == 2) { // translucent background during black hole phase
        background(0, 0, 0, 5);
    }
    else {
        background(0);
    }

    //handling supernova particles
    for (let i = 0; i < supernovaCount; i++) {
        supernovaArray[i].display();
        supernovaArray[i].move();
    }
}

function phase2() {
    print('switch to phase 2');
    if (phase == 0) {
        phase = 1;
    }
}

function phase3() {
    print('switch to phase 3');
    phase = 2;
}

function blackHole() {
    // black circle center screen 
    spot.display();
}

class SmallParticle {
    constructor() {
        this.pos = createVector(random(width), random(height)); //random starting position
        this.speed = { // speed (velocity multiplier)
            x: random(4, 6),
            y: random(4, 6)
        }
        this.velocity = { // velocity (direction)
            x: random(-1, 1),
            y: random(-1, 1)
        };
        this.radius = 10
        this.color = color(236, 157, 237, 200); // purple
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draws particle
        ellipse(this.pos.x, this.pos.y, this.radius);
    }

    move() {
        if (crush != true) {
            this.pos.x += this.speed.x * this.velocity.x; // handles x movement
            this.pos.y += this.speed.y * this.velocity.y; // handles y movement

            this.pos.x += random(-3, 3); // shake x
            this.pos.y += random(-3, 3); // shake y

            //particles bounce off of screen bounds
            if (this.pos.x <= 1 || this.pos.x >= width - 1) {
                this.velocity.x *= -1;
            } else if (this.pos.y <= 1 || this.pos.y >= height - 1) {
                this.velocity.y *= -1;
            }
        } else { // when crush is true, particles move to center 
            p5.Vector.lerp(this.pos, center, 0.01, this.pos);
        }
    }

}

class MedParticle {
    constructor(x, y) {
        this.pos = createVector(x, y); // position is passed through from colliding smaller particle positions
        this.speed = { // speed (velocity multiplier)
            x: random(2, 4),
            y: random(2, 4)
        }
        this.velocity = { // velocity (direction)
            x: random(-1, 1),
            y: random(-1, 1)
        };
        this.radius = 20
        this.color = color(200, 128, 183, 200); // darker purple
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draws particle
        ellipse(this.pos.x, this.pos.y, this.radius);
    }

    move() {
        if (crush != true) {
            this.pos.x += this.speed.x * this.velocity.x; // handles x movement
            this.pos.y += this.speed.y * this.velocity.y; // handles y movement

            this.pos.x += random(-2, 2); // shake x
            this.pos.y += random(-2, 2); // shake y

            //particles bounce off of screen bounds
            if (this.pos.x <= 1 || this.pos.x >= width - 1) {
                this.velocity.x *= -1;
            } else if (this.pos.y <= 1 || this.pos.y >= height - 1) {
                this.velocity.y *= -1;
            }
        } else { // when crush is true, particles move to center 
            p5.Vector.lerp(this.pos, center, 0.01, this.pos);
        }
    }
}

class LargeParticle {
    constructor(x, y) {
        this.pos = createVector(x, y); // position is passed through from colliding smaller particle positions
        this.speed = { // speed (velocity multiplier)
            x: random(2, 3),
            y: random(2, 3)
        }
        this.velocity = { // velocity (direction)
            x: random(-1, 1),
            y: random(-1, 1)
        };
        this.radius = 40
        this.color = color(159, 107, 160, 150); // darkest purple
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius * 2); // draws particle
        ellipse(this.pos.x, this.pos.y, this.radius);
        ellipse(this.pos.x, this.pos.y, this.radius * 1.5);
        ellipse(this.pos.x, this.pos.y, this.radius * 0.5);
    }

    move() {
        if (crush != true) {
            this.pos.x += this.speed.x * this.velocity.x; // handles x movement
            this.pos.y += this.speed.y * this.velocity.y; // handles y movement

            this.pos.x += random(-1, 1); // shake x
            this.pos.y += random(-1, 1); // shake y

            //particles bounce off of screen bounds
            if (this.pos.x <= 1 || this.pos.x >= width - 1) {
                this.velocity.x *= -1;
            } else if (this.pos.y <= 1 || this.pos.y >= height - 1) {
                this.velocity.y *= -1;
            }
        } else { // when crush is true, particles move to center
            p5.Vector.lerp(this.pos, center, 0.01, this.pos);
        }
    }

}

class Supernova {
    constructor() {
        this.pos = { // starts at center screen
            x: width / 2,
            y: height / 2
        }
        this.velocity = { // velcity (direction)
            x: random(-1, 1),
            y: random(-1, 1)
        }

        this.invertedVelocity = { // inverse of velocity
            x: -this.velocity.x,
            y: - this.velocity.y
        }
        this.size = random(5, 140);
        this.color = color(random(255), random(255), random(255), random(150));
        this.speed = 8;
        this.endPos = random(-100, 100); // end position value (+500) is the radius away from center that the particle will stop moving at
        this.distanceSeed = int(random(5)); // seed to help randomly distribute end pos
        this.distToCenter; //distance from the particle to the center of the screen
    }

    setup() {
        switch (this.distanceSeed) { // this staggers the end position to keep it from looking like a clear cut shape
            case 0:
                this.endPos = random(100, 300);
                break;
            case 1:
                this.endPos = random(-150, 100);
                break;
            case 2:
                this.endPos = random(100, 200);
                break;
            default:
                break;
        }
    }

    display() { //displaying the particle
        noStroke();
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.size);
        circle(this.pos.x, this.pos.y, this.size / 2);
    }

    move() { // moving the particle
        this.distToCenter = dist(this.pos.x, this.pos.y, width / 2, height / 2); // assigning and updating dist
        if (phase == 1) {
            if (this.distToCenter <= 500 + this.endPos) { // unless the distance to center meets end pos + 500, move away from center
                this.pos.x += this.velocity.x * this.speed;
                this.pos.y += this.velocity.y * this.speed;
            } else {
                this.pos.x += random(-1, 1);
                this.pos.y += random(-1, 1);
            }
        } else if (this.distToCenter >= 5) { // if the phase changes, move towards the center 
            this.pos.x += this.invertedVelocity.x * this.speed;
            this.pos.y += this.invertedVelocity.y * this.speed;
        }
    }
}

class BlackHole {
    constructor() {
        this.pos = { // starts at center screen
            x: width / 2,
            y: height / 2
        }
    }

    display() {
        noStroke();
        fill(0);
        circle(this.pos.x, this.pos.y, 60);
    }
}

class FusionEnergy {
    constructor(x, y) {
        this.pos = {
            x,
            y
        }
        this.size = 0;
        this.alpha = 255;
        this.color = color(255, 255, 255, this.alpha);
        this.counter = 0;
    }

    display() {
        print('spawned');
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size)
    }

    grow() {
        this.size += 5;
        this.alpha -= 8;
        this.counter++;
        this.color = color(255, 255, 255, this.alpha);
    }
}