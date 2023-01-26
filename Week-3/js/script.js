var myParticle = [];
var myParticle2 = [];

function setup() {
    createCanvas(1500, 1500);
    background(100);

    for (let i = 0; i < 50; i++) {
        myParticle[i] = new Particle;
        myParticle2[i] = new Particle2;
    }
}

function draw() {
    background(100);
    for (let i = 0; i < myParticle.length; i++) {


        if (mouseIsPressed && mouseX >= myParticle[i].xPos - myParticle[i].size / 2 && mouseX <= myParticle[i].xPos + myParticle[i].size / 2 && mouseY >= myParticle[i].yPos - myParticle[i].size / 2 && mouseY <= myParticle[i].yPos + myParticle[i].size / 2) {
            print("DESTROY!!!!!!!!!");
            //myParticle[i].size = 0;
            myParticle.splice(i, 1);
        }
        myParticle[i].move();
        myParticle2[i].move();
    }

}

class Particle {
    constructor() {
        this.xPos = random(width);
        this.yPos = random(width);
        this.size = random(10, 80);
        this.stroke = color(random(0, 255));
        this.speedMin = 2;
        this.speedMax = 7;
        this.speed;
    }

    move() {
        this.speed = map(mouseY, 0, height, this.speedMin, this.speedMax);
        this.xPos += random(-this.speed, this.speed);
        this.yPos += random(-this.speed, this.speed);
        stroke(this.stroke);
        fill(this.xPos, this.yPos, this.size);
        circle(this.xPos, this.yPos, this.size);

        if (this.xPos >= width - this.size / 2) {
            this.xPos = width - this.size / 2;
        } else if (this.xPos <= 0 + this.size / 2) {
            this.xPos = 0 + this.size / 2;
        } else if (this.yPos >= height - this.size / 2) {
            this.yPos = height - this.size / 2;
        } else if (this.yPos <= 0 + this.size / 2) {
            this.yPos = 0 + this.size / 2;
        }

    }



}

class Particle2 {
    constructor() {
        this.xPos = random(width);
        this.yPos = random(height);
        this.speed = 5;
        this.size = random(5, 10);
        this.color = (100, 0, 100);
    }

    move() {
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.size);
        this.yPos += this.speed;

        if (this.yPos > height + this.size) {
            this.yPos = -50;
        }

    }
}