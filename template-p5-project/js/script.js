/**
Exercise 1 - CART 263
Jenna Brown

Completed week of January 12, 2023
Pong in p5js
*/

"use strict";
//object speeds
var paddleSpeed = 10;
var ballSpeed = 10;
//player scores
var leftScore = 0;
var rightScore = 0;
//object variables (used for instantiation & identification)
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
var endText; // text displayed on end screen 

function setup() {
    createCanvas(1500, 1100);
    background(0);

    leftPaddle = new Paddle();
    leftPaddle.spawn();

    rightPaddle = new Paddle();
    rightPaddle.posX = width - rightPaddle.sizeX; // setting position to right side of screen
    rightPaddle.spawn();

    ball = new Ball();
    ball.spawn();
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
        ball.posX = width / 2;
        ball.posY = height / 2;
    }
    if (ball.posX <= 0) {
        RightScore++;
        ball.posX = width / 2;
        ball.posY = height / 2;
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

    if (leftScore >= 10 || rightScore >= 10) {
        gameOver = true;
    }

}

function endScreen() {
    background(0);
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
        this.speed = paddleSpeed;
        //position
        this.posX = 0;
        this.posY = height / 2;
        //size setup
        this.sizeX = 25;
        this.sizeY = 100;
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
        if (this.keyUp) {
            this.posY -= this.speed;
        } else if (this.keyDown) {
            this.posY += this.speed;
        }

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
        this.speed = ballSpeed;
        this.posX = width / 2;
        this.posY = (height - 100) / 2;
        this.size = 20;
    }

    spawn() {
        noStroke();
        fill(this.fill);
        circle(this.posX, this.posY, this.size);
    }
}
