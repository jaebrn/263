let weather;
let time = 0;
let usingRealTime = false;
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
let cloudIndex;
let cloudCover;
let cloudCount;

//Rain:
let rainArray = [];
let softAudio;
let heavyAudio;
let rainAmt = 300;
let thunderAudio;

//Environment   
let windSpeed;
let windDir;
let mountain;
let ambience;


function preload() {
    weather = loadJSON('https://api.open-meteo.com/v1/forecast?latitude=-33.95&longitude=151.18&hourly=temperature_2m,rain,showers,snowfall,cloudcover,visibility,windspeed_10m,winddirection_10m&daily=sunrise,sunset&current_weather=true&timezone=Australia%2FSydney');

    //normally I would use a for loop for this
    //when using a for loop i get an error that width cannot be read even when provided
    //I read up on it and this seems to be a known bug
    //i swear i know how to use loops
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

    mountain = loadImage('assets/Mountain.PNG');

    softAudio = loadSound('assets/Audio/softrain.mp3');
    heavyAudio = loadSound('assets/Audio/heavyrain.mp3');
    thunderAudio = loadSound('assets/Audio/thunder.mp3');
    ambience = loadSound('assets/Audio/background.mp3');

}

function setup() {
    //Settings
    setAttributes('willReadFrequently', true);
    createCanvas(1920, 1080);
    background(0);
    colorMode(HSB, 360);
    angleMode(DEGREES);

    // sky bg bars
    barHeight = height / barCount;

    //Instantiating stars
    for (i = 0; i < starCount; i++) {
        starArray[i] = new Star;
        starArray[i].setup();
    }

    //Getting values from API
    cloudIndex = weather.hourly.cloudcover.length - 1;
    cloudCover = weather.hourly.cloudcover[cloudIndex];
    rainAmt = weather.hourly.rain[cloudIndex] * 5;
    windSpeed = weather.current_weather.windspeed;
    windDir = weather.current_weather.winddirection;
}

function draw() {
    //Time override
    if (usingRealTime) {
        time = hour();
    } else {
        time += 0.01;
        if (time >= 24) {
            time = 0
        }
    }

    //star opacity lowered if daytime
    //sky color/brightness changes with time
    if (time <= 12) {
        starOpacity = map(time, 0, 12, 360, 0);
        skyHue = map(time, 0, 12, 250, 210);
        skyBright = map(time, 0, 12, 50, 150);
    } else {
        starOpacity = map(time, 12, 24, 0, 360);
        skyHue = map(time, 12, 24, 210, 250);
        skyBright = map(time, 12, 24, 150, 50);
    }

    //Rotating elements:
    push();
    sky(); // draws sky
    sun(); // draws sun
    for (i = 0; i < starCount; i++) { // draws stars
        starArray[i].display();
    }
    pop();

    push();
    moon(); // draws moon (diff rotation)
    pop();
    //End rotation

    //clouds:
    cloudCount = cloudCover * 1.5;

    if (cloudCount > cloudArray.length) { //instantiation
        cloudArray.push(new Cloud);
    }

    for (i = 0; i < cloudArray.length; i++) {
        cloudArray[i].move();
        if (cloudArray[i].x > width) {
            cloudArray.splice(i, 1); // cloud removed when out of bounds
        }
    }

    image(mountain, 0, 150, width, height); // draws mountains

    //Rain:
    if (rainAmt > 0) {
        if (rainArray.length < rainAmt) {
            rainArray.push(new Rain);
        }

        for (i = 0; i < rainArray.length; i++) {
            rainArray[i].move();
            if (rainArray[i].y > height) {
                rainArray.splice(i, 1); //removed when out of bounds
            }
        }

        if (rainAmt <= 200) { // different audio depending on amount of rain
            if (softAudio.isPlaying()) {
            } else {
                softAudio.play();
            }
        } else {
            if (heavyAudio.isPlaying()) {
            } else {
                heavyAudio.play();
            }
            let rand = int(random(0, 150));
            //print(rand);
            if (rand == 0) {
                thunder(); // random thunder when raining heavily
            }
        }
    } else {
        if (ambience.isPlaying()) { //background audio
        } else {
            ambience.play();
        }

    }
}

function sky() { // fills in background bars
    for (i = 0; i < barCount; i++) {
        noStroke();
        fill(skyHue - i, 200, i * 7 + skyBright);
        rect(0, i * barHeight, width, barHeight + 5);
    }
}

function sun() {
    fill(48, 200, 360, 250);
    translate(width / 2, height / 1.1);
    rotate(time * 15 + 55); // rotates with time
    circle(700, 400, 80);
    circle(700, 400, 100);
}

function moon() {
    fill(0, 0, 260);
    translate(width / 2, height / 1.25);
    rotate((time * 10 + 105)); // rotates with time
    circle(700, 400, 100);
}

function thunder() {
    print('thunder');
    fill(0, 0, 360); // screen flashes
    rect(0, 0, width, height);
    thunderAudio.play();

}

class Star {
    constructor() {
        this.x;
        this.y;
        this.maxSize = 4;
        this.size;
    }

    setup() {
        this.size = random(1, this.maxSize);
        this.x = random(-width, width * 2);
        this.y = random(-height, height * 2);
    }

    display() {
        this.opacity = starOpacity + random(-50, 50);
        fill(200, 45, 360, starOpacity);
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
        image(cloudAssets[this.seed], this.x, this.y, this.size, this.size);
    }
}

class Rain {
    constructor() {
        this.x = random(-width, width);
        this.y = random(-520, 0);
        this.speed = windSpeed * 2;
        this.angle = windDir;
        this.length = windSpeed * random(2, 6);
        this.x2 = this.x + this.length;
        this.y2 = this.y + this.length;
    }

    move() {
        stroke(0, 0, 360, 200);
        strokeWeight(5);

        line(this.x, this.y, this.x2, this.y2);
        this.x += this.speed;
        this.x2 += this.speed;
        this.y += this.speed;
        this.y2 += this.speed;
    }
}



/*Next steps:
    Sprite for sun/moon (needs to deal with rotation...)
    Tints on clouds and mountains!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    Z-index clouds & adjust speed/size/opacity
    Random events (birds in the sky, rainbow, etc)
    Seasons
*/
