let weather;
let time = 0;
let angle = 235 + 90;

//Sky:
let barCount = 32;
let barHeight;
let skyHue = 250;
let skyBright = 50;

//Stars:
let starCount = 4000;
let starArray = [];
let starOpacity;


function preload() {
    weather = loadJSON('https://api.open-meteo.com/v1/forecast?latitude=-33.95&longitude=151.18&hourly=temperature_2m,rain,showers,snowfall,cloudcover,visibility,windspeed_10m,winddirection_10m&daily=sunrise,sunset&current_weather=true&timezone=Australia%2FSydney');
}


function setup() {
    createCanvas(1920, 1080);
    background(0);
    colorMode(HSB, 360);
    angleMode(DEGREES);

    barHeight = height / barCount;

    for (i = 0; i < starCount; i++) {
        starArray[i] = new Star;
        starArray[i].setup();
    }
}

function draw() {
    time += 0.1;
    if (time >= 24) {
        time = 0
    }
    print(time);

    if (time <= 12) {
        starOpacity = map(time, 0, 12, 360, 0);
    } else {
        starOpacity = map(time, 12, 24, 0, 360);
    }

    sky();
    sun();
    for (i = 0; i < starCount; i++) {
        starArray[i].display();
    }
}

function sky() {
    for (i = 0; i < barCount; i++) {
        noStroke();
        fill(skyHue - i, 200, i * 7 + skyBright);
        rect(0, i * barHeight, width, barHeight);
    }
}

function sun() {
    fill(360, 0, 360, 250);
    translate(width / 2, height / 1.1);
    rotate(time * 15 + 55);
    circle(700, 400, 80);
    circle(700, 400, 100);
}


class Star {
    constructor() {
        this.x;
        this.y;
        this.maxSize = 4;
        this.size;
        this.visibility;
        this.opacity = starOpacity;
    }

    setup() {
        this.size = random(1, this.maxSize);
        this.x = random(-width, width * 2);
        this.y = random(-height, height * 2);
    }

    display() {
        this.opacity = starOpacity + random(-50, 50);
        fill(200, 45, 360, this.opacity);
        circle(this.x, this.y, this.size);
    }
}

class Cloud {
    constructor() {
        this.x;
        this.y;
        this.w;
        this.h;

    }
}

//Reference
    // cloudIndex = weather.hourly.cloudcover.length - 1;
    // cloudCover = weather.hourly.cloudcover[cloudIndex];
    // text("Current wind speed:" + weather.current_weather.windspeed, 250, 250);
    // text("Current wind direction:" + weather.current_weather.winddirection, 250, 285);
