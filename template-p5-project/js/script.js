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
//gameOverScreen displays if score is over 10
var gameOver = false;

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
    if (leftScore >= 10 || rightScore >= 10) {
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
    fill(50);
    rect(0, 0, width, 100)
}

function endScreen() {
    background(0);
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
