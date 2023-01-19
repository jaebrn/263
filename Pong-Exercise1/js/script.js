/**
Exercise 1 - CART 263
Jenna Brown

Completed week of January 12, 2023
Pong in p5js!!!!!!
*/

"use strict";
//player scores
var leftScore = 0;
var rightScore = 0;
//object variable declaration
//vars for these instances can be found in their class' constructor
var ball;
var leftPaddle;
var rightPaddle;
//storing key codes for easy recall
var keycodeW = 87;
var keycodeS = 83;
var keycodeUp = 38;
var keycodeDown = 40;
//endScreen displays if score is over 10
var gameOver = false; // false until score >=10
var endText; // text displayed on end screen - varies depending on winning player

function setup() {
    createCanvas(1500, 1100);
    background(0);

    //instantiation
    leftPaddle = new Paddle();
    rightPaddle = new Paddle();
    rightPaddle.posX = width - rightPaddle.sizeX; // setting position to right side of screen
    ball = new Ball();
}


function draw() {

    //game manager
    if (gameOver == true) {
        endScreen();
    } else {
        game();
    }
}

function game() {

    background(0);
    leftPaddle.spawn();
    rightPaddle.spawn();
    ball.spawn();
    ball.move();

    // left paddle moves up when 'W' is pressed
    if (keyIsDown(keycodeW)) {
        print("W key pressed");
        leftPaddle.keyUp = true;
        leftPaddle.move();
    } else {
        leftPaddle.keyUp = false;
        leftPaddle.move();
    }

    //left paddle moves down when 'S' is pressed
    if (keyIsDown(keycodeS)) {
        print('S key pressed');
        leftPaddle.keyDown = true;
        leftPaddle.move();
    } else {
        leftPaddle.keyDown = false;
        leftPaddle.move();
    }

    //right paddle moves up when up arrow is pressed
    if (keyIsDown(keycodeUp)) {
        print("Up Arrow pressed");
        rightPaddle.keyUp = true;
        rightPaddle.move();
    } else {
        rightPaddle.keyUp = false;
        rightPaddle.move();
    }

    //right paddle moves down when down arrow is pressed
    if (keyIsDown(keycodeDown)) {
        print("Down Arrow pressed");
        rightPaddle.keyDown = true;
        rightPaddle.move();
    } else {
        rightPaddle.keyDown = false;
        rightPaddle.move();
    }

    // score increases + ball resets if out of bounds
    if (ball.posX >= width) {
        leftScore++;
        ball.respawn();
    }
    if (ball.posX <= 0) {
        rightScore++;
        ball.respawn();
    }

    // score
    fill(30); // grey
    rect(0, 0, width, 100) // score box
    textSize(60);
    textAlign(CENTER, CENTER);
    fill(255);
    text(leftScore, width / 2 - 100, 50); //left score
    text("|", width / 2, 50); //divider
    text(rightScore, width / 2 + 100, 50); //right score

    //end screen displays once a score is greater than 10
    if (leftScore >= 10 || rightScore >= 10) {
        gameOver = true;
    }

}

function endScreen() {
    background(0);
    // text displayed on end screen depends on the winning player
    if (leftScore >= 10) {
        endText = "Left Player Wins."
    } else {
        endText = "Right Player Wins."
    }
    fill(255);
    textSize(80);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, 250);
    text(endText, width / 2, 335);
    textSize(100);
    text("Press Enter to Play Again", width / 2, height / 2);

    // when the enter key is pressed on the end screen, the game resets
    if (keyIsDown(13)) {
        leftScore = 0;
        rightScore = 0;
        gameOver = false;
    }

}


class Paddle {
    constructor() {
        //color setup
        this.fill = 255;
        //speed
        this.speed = 7;
        //position
        this.posX = 0;
        this.posY = height / 2;
        //size setup
        this.sizeX = 25;
        this.sizeY = 200;
        //movement bools
        this.keyUp = false;
        this.keyDown = false;
    }

    spawn() {
        noStroke();
        fill(this.fill);
        rect(this.posX, this.posY, this.sizeX, this.sizeY);
    }

    move() {
        //paddle moves depending on key presses
        if (this.keyUp) {
            this.posY -= this.speed;
        } else if (this.keyDown) {
            this.posY += this.speed;
        }

        //bounds are set - paddles cannot go offscreen 
        if (this.posY >= height - this.sizeY) {
            this.posY = height - this.sizeY;
        } else if (this.posY <= 100) {
            this.posY = 100;
        }
    }
}

class Ball {
    constructor() {
        this.fill = 255;
        // randArray is used to randomize the starting direction of the ball, which can be reflected over the x and y axes depending on the sign of the chosen element
        this.randArray = [-1, 1];
        this.speedY = 6 * random(this.randArray);
        this.speedX = 6 * random(this.randArray);
        this.posX = width / 2;
        this.posY = (height - 100) / 2;
        this.size = 20;
    }

    spawn() {
        noStroke();
        fill(this.fill);
        circle(this.posX, this.posY, this.size);
    }

    move() {
        //movement - moves by speed each time move() is called
        this.posX += this.speedX;
        this.posY += this.speedY;

        //sets bounds - bottom of screen, top of screen beneath the score box 
        //when the ball meets these bounds, its speed becomes reflected over the y-axis (bounces off)
        if (this.posY >= height - (this.size / 2) || this.posY <= 100 + (this.size / 2)) {
            this.speedY *= -1;
        }
        print(this.speedY);

        //sets additional reflective bounds - paddles
        //when the ball hits a paddle, it is reflected over both axes
        if (this.posY > rightPaddle.posY - rightPaddle.sizeY / 2 && this.posY < rightPaddle.posY + rightPaddle.sizeY / 2 && this.posX >= width - rightPaddle.sizeX / 2) {
            this.speedX *= -1;
            this.speedY *= -1;
            print('REFLECTED RIGHT');
        } else if (this.posY > leftPaddle.posY - leftPaddle.sizeY / 2 && this.posY < leftPaddle.posY + leftPaddle.sizeY / 2 && this.posX <= rightPaddle.sizeX / 2) {
            this.speedX *= -1;
            this.speedY *= -1;
            print('REFLECTED LEFT');
        }
    }
    respawn() {
        //ball variables are reset upon respawn. This makes the initial direction randomized
        this.posX = width / 2;
        this.posY = height / 2;
        this.speedY = 6 * random(this.randArray);
        this.speedX = 6 * random(this.randArray);
        this.spawn();
    }
}

/*NEXT STEPS:
    - reflected ball velocity from paddles depends on other variables, like the speed of the paddle upon collision
        (currently the ball gets stuck in the same patterns of reflection)
    - changing speeds and increasing difficulty
*/
