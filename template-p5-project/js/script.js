/**
Exercise 1 - CART 263
Jenna Brown

Completed week of January 12, 2023
Pong in p5js
*/

"use strict";
//object speeds
var paddleSpeed = 0;
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

function setup() {
    createCanvas(1500, 1000);
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
        this.keyDown = true;
    }

    spawn() {
        noStroke();
        fill(this.fill);
        rect(this.posX, this.posY, this.sizeX, this.sizeY);
    }

    move() {

    }
}

class Ball {
    constructor() {
        this.fill = 255;
        this.speed = ballSpeed;
        this.posX = width / 2;
        this.posY = height / 2;
        this.size = 20;
    }

    spawn() {
        noStroke();
        fill(this.fill);
        circle(this.posX, this.posY, this.size);
    }
}