//DEFINE A SIMPLE 3D UNIVERSE without Newtonian physics by @enoxh

//Explore this as a mechanism for data storage/processing, creating game spaces, servers, etc.

//currently changing scale is cutting the original scale in half/doubling
// Universe is composed of a cubic size, XYZ axis and scale and time
//places are expressed as a result of a particle existing at specific X,Y and Z coordinates at a scale and time range.
// A place does not exist until a particle exists there
//A place can contain a large but fixed number of particles
//There is no scale = 0

//We keep track of particles by the places they create when they occupy them.

//The Place and it's particles exist when The Observer observes a particle or particles, which creates a place.



//Keeps track of where things are in the universe
var Matter = {
    //slot 0 is observer's last known pos in universe   
    'x': [0, 100, 200],
    'y': [0, 100, 200],
    'z': [0, 100, 200],
    'scale': [1, 1, 1],
    'particleID': [1, 2, 3]
}

//Basic definition of this Universe
var Universe = {
    fps: 60,
    width: 800,
    height: 800,
    depth: 800,
    scale: 1
};

//Basic definition of a particle
var Particle = {
    pid: [
// x,y,z,scale
[100, 100, 100, 1],
[200, 200, 200, 1]
]
};


//start time
var unitime = 0;


//CREATE A UNIVERSE WITH AN ARROW OF TIME

//create a callback function that animates time
Universe._onEachFrame = (function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.requestAnimationFrame;

    if (requestAnimationFrame) {
        return function (cb) {
            var _cb = function () {
                cb();
                requestAnimationFrame(_cb);
            }
            _cb();
        };
    } else {
        return function (cb) {
            setInterval(cb, 1000 / Universe.fps);
        }
    }
})();


//BIG BANG  CREATE SPACE/TIME AND AN OBSERVER
Universe.start = function () {
    Universe.canvas = document.createElement("canvas");
    Universe.canvas.width = Universe.width;
    Universe.canvas.height = Universe.height;
    Universe.context = Universe.canvas.getContext("2d");
    document.body.appendChild(Universe.canvas);
    Universe.observer = new Observer();
    Universe._onEachFrame(Universe.run);


};


//-----TIME
Universe.run = (function () {
    var loops = 0,
        skipTicks = 1000 / Universe.fps,
        maxFrameSkip = 10,
        nextUniverseTick = (new Date).getTime(),
        lastUniverseTick;

    return function () {
        loops = 0;

        while ((new Date).getTime() > nextUniverseTick) {
            Universe.update();
            nextUniverseTick += skipTicks;
            loops++;

        }

        if (loops) Universe.draw();
    }
})();



//-----RENDER UNIVERSE
Universe.draw = function () {
    //DRAW SPACE
    Universe.context.clearRect(0, 0, Universe.width, Universe.height);
    //DRAW OBSERVER
    Universe.observer.draw(Universe.context);
    //PARTICLES
    Particles.drawParticles();
    //PLACES



};


//-----COUNT TIME
Universe.showTime = function (unitime) {
    document.getElementById('utime').innerHTML = 'Moments since the Big Bang: ' + unitime % .01;

};

//-----CALC # OF PARTICLES IN UNIVERSE
Universe.calcPosTotal = function () {
    var totalpos;
    totalpos = Math.pow(Universe.width, 3) * Universe.scale;

    //display results
    document.getElementById('status').innerHTML = 'Total # of Places: ' + totalpos + ' at a scale of ' + Universe.scale;


};

//-----MESSAGES
Universe.showMessages = function () {

    var content = '';

    content += Universe.showSize();
    content += Observer.prototype.show();

    //display results
    document.getElementById('messages').innerHTML = content;


};

//-----CALC SIZE OF UNIVERSE

Universe.getSize = function () {

    var totalplaces = Math.pow(Universe.width, 3) * Universe.scale;

    return totalplaces;

};






//-----SHOW SIZE OF UNIVERSE

Universe.showSize = function () {

    var content = "The universe is " + (Universe.width * Universe.scale) + " wide and " + (Universe.height * Universe.scale) + " high and " + (Universe.depth * Universe.scale) + " deep at a scale of " + Universe.scale + ".";

    return content;

};

//----- UPDATE ARROW OF TIME
Universe.update = function ()

{

    unitime++;
    Universe.showTime(unitime);
    Universe.calcPosTotal();
    Universe.showMessages();
    Particles.getObjectCount();


};


//-----OBSERVER

//-----
function Observer() {
    this.x = Universe.width / 2 * Universe.scale;
    this.y = Universe.height / 2 * Universe.scale;
    this.z = Universe.depth / 2 * Universe.scale;
    this.scale = Universe.scale;

};


//-----
Observer.prototype.draw = function (context) {
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, 12, 12);
    context.font = "10px Arial";
    context.fillText("Obs: " + this.x + " " + this.y + "", this.x, this.y);

};

Observer.prototype.show = function () {

    var content = '<h3>The Observer is at: X:' + Matter.x[0] + ' Y:' + Matter.y[0] + ' Z:' + Matter.z[0] + ' </h3>'

    return content;;
};





//-----
Observer.prototype.update = function () {
    Matter.x[0] = this.x * Universe.scale;
    Matter.y[0] = this.y * Universe.scale;
    Matter.z[0] = this.z * Universe.scale;
    document.getElementById('x').innerHTML = Matter.x[0];
    document.getElementById('y').innerHTML = Matter.y[0];
    document.getElementById('z').innerHTML = Matter.z[0];
};



//PARTICLES
function Particles() {};

// DEFINE A PARTICLE AS AN ID
Particles.assignPID = function () {


    var maxRange = Particles.getObjectCount();
    var newID = maxRange++;

    //CREATES A NEW PARTICLE
    //Particle.pid.push(3,3,3,1);

    document.getElementById('messages').innerHTML += Particle.pid[0][0];

};



//-----COUNT PARTICLES
Particles.getObjectCount = function () {

    var pcount = countProperties(Particle['pid']);
    document.getElementById('pcount').innerHTML = "There are " + pcount + " particles in the universe.";
    return pcount;
};


//-----SHOW PARTICLE INFO
Particles.showParticles = function () {

    var count = Particles.getObjectCount(Particle['pid']);


    for (var i = 0; i < count; i++) {

        if (Particle.pid[i][3] == Universe.scale) {

            document.getElementById('pcount1').innerHTML += "<br/>A Particle  exists at X:" + Particle.pid[i][0] * Particle.pid[i][3] + " Y:" + Particle.pid[i][1] * Particle.pid[i][3] + " Z:" + Particle.pid[i][2] * Particle.pid[i][3] + " At a scale of: " + Particle.pid[i][3];
        }
    }
};



Particles.drawParticles = function () {


    var count = Particles.getObjectCount(Particle['pid']);

    for (var i = 0; i < count; i++) {

        if (Particle.pid[i][3] == Universe.scale) {

            var curposx = Particle.pid[i][0] * Particle.pid[i][3];
            var curposy = Particle.pid[i][1] * Particle.pid[i][3]
            var curposz = Particle.pid[i][2] * Particle.pid[i][3];
            var curscale = Particle.pid[i][3];
            Universe.context.fillStyle = "green";
            Universe.context.fillRect(curposx, curposy, curscale * 10, curscale * 10);
            Universe.context.font = "10px Arial";
            Universe.context.fillText("Particle" + curposx + " " + curposy + "", curposx, curposy);
        }
    }

};









//-----
Particles.getLocation = function (id) {






};



//STANDARD FUNCTIONS

//----- COUNTS KEYS IN AN OBJECT
function countProperties(obj) {
    //ECMA5
    return Object.keys(obj).length;
};

//----- CHANGES SCALE
function shrinkScale() {

    if (Universe.scale > 0 && Universe.scale - 1 == 0) {
        Universe.scale = -1;
    } else {
        Universe.scale--;
    }
};

//----- CHANGES SCALE
function growScale() {

    if (Universe.scale < 0 && Universe.scale + 1 == 0) {
        Universe.scale = 1;
    } else {
        Universe.scale++;
    }
};

//----- GETS THE TIME
function getUTime() {
    var snapshot = unitime;
    return snapshot;

};