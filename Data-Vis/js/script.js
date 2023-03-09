let weather;
let time = 0;
let angle = 235 + 90; // rotation for sun/moon/stars

//Sky:
let barCount = 32;
let barHeight;
let skyHue = 250;
let skyBright = 50;

//Stars:
let starCount = 4000;
let starArray = [];
let starOpacity;

//Clouds:
let cloudArray = [];
let cloudAssets = [17];
let windSpeed;
let cloudIndex;
let cloudCover;
let cloudCount;


function preload() {
    weather = loadJSON('https://api.open-meteo.com/v1/forecast?latitude=-33.95&longitude=151.18&hourly=temperature_2m,rain,showers,snowfall,cloudcover,visibility,windspeed_10m,winddirection_10m&daily=sunrise,sunset&current_weather=true&timezone=Australia%2FSydney');

    cloudAssets[0] = loadImage('assets/Clouds/0.PNG');
    cloudAssets[1] = loadImage('assets/Clouds/1.PNG');
    cloudAssets[2] = loadImage('assets/Clouds/2.PNG');
    cloudAssets[3] = loadImage('assets/Clouds/3.PNG');
    cloudAssets[4] = loadImage('assets/Clouds/4.PNG');
    cloudAssets[5] = loadImage('assets/Clouds/5.PNG');
    cloudAssets[6] = loadImage('assets/Clouds/6.PNG');
    cloudAssets[7] = loadImage('assets/Clouds/7.PNG');
    cloudAssets[8] = loadImage('assets/Clouds/8.PNG');
    cloudAssets[9] = loadImage('assets/Clouds/9.PNG');
    cloudAssets[10] = loadImage('assets/Clouds/10.PNG');
    cloudAssets[11] = loadImage('assets/Clouds/11.PNG');
    cloudAssets[12] = loadImage('assets/Clouds/12.PNG');
    cloudAssets[13] = loadImage('assets/Clouds/13.PNG');
    cloudAssets[14] = loadImage('assets/Clouds/14.PNG');
    cloudAssets[15] = loadImage('assets/Clouds/15.PNG');
    cloudAssets[16] = loadImage('assets/Clouds/16.PNG');
    cloudAssets[17] = loadImage('assets/Clouds/17.PNG');

}


function setup() {
    setAttributes('willReadFrequently', true);
    createCanvas(1920, 1080);
    background(0);
    colorMode(HSB, 360);
    angleMode(DEGREES);

    barHeight = height / barCount;

    for (i = 0; i < starCount; i++) {
        starArray[i] = new Star;
        starArray[i].setup();
    }

    cloudIndex = weather.hourly.cloudcover.length - 1;
    cloudCover = weather.hourly.cloudcover[cloudIndex];
    windSpeed = weather.current_weather.windspeed;
    print(windSpeed);
    //print(cloudCover);

}

function draw() {
    time += 0.04;
    if (time >= 24) {
        time = 0
    }
    //print(time);

    if (time <= 12) {
        starOpacity = map(time, 0, 12, 360, 0);
    } else {
        starOpacity = map(time, 12, 24, 0, 360);
    }

    //Rotating elements:
    push();
    sky();
    sun();
    for (i = 0; i < starCount; i++) {
        starArray[i].display();
    }
    pop();
    //End rotation

    cloudCount = cloudCover;
    //print(cloudCount);

    if (cloudCount > cloudArray.length) {
        cloudArray.push(new Cloud);
    }

    for (i = 0; i < cloudArray.length; i++) {
        cloudArray[i].move();
        if (cloudArray[i].x > width) {
            cloudArray.splice(i, 1);
        }
    }

}

function sky() {
    for (i = 0; i < barCount; i++) {
        noStroke();
        fill(skyHue - i, 200, i * 7 + skyBright);
        rect(0, i * barHeight, width, barHeight + 5);
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
        this.x = random(-2500, -400);
        this.y = random(0, height / 2);
        this.size = random(350, 550);
        this.speed = random(windSpeed / 8, windSpeed / 2);
        this.seed = int(random(0, cloudAssets.length));
    }

    move() {
        this.x += this.speed;
        noStroke();
        //tint(360, 200);
        //blendMode(SCREEN, 0.6);
        image(cloudAssets[this.seed], this.x, this.y, this.size, this.size);
        // noTint();
        //blendMode(NORMAL);
    }
}

//Reference
    // cloudIndex = weather.hourly.cloudcover.length - 1;
    // cloudCover = weather.hourly.cloudcover[cloudIndex];
    // text("Current wind speed:" + weather.current_weather.windspeed, 250, 250);
    // text("Current wind direction:" + weather.current_weather.winddirection, 250, 285);
