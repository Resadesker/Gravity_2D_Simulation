const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const bounceSound = document.getElementById('bounceSound');
const totalDuration = 16000000;
const starRadius = 50;
const initialPlanetSize = 10;
const gravity = 250;
const collisionDelay = 500;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const canvasCenterX = canvasWidth / 2;
const canvasCenterY = canvasHeight / 2;

let startTime = Date.now();

class Planet {
    constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.lastCollision = Date.now();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    update() {
        const distanceX = canvasCenterX - this.x;
        const distanceY = canvasCenterY - this.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const force = gravity * (0.1 * starRadius) / (distance * distance);
        const angle = Math.atan2(distanceY, distanceX);

        this.dx += Math.cos(angle) * force;
        this.dy += Math.sin(angle) * force;

        this.x += this.dx;
        this.y += this.dy;

        if (distance < starRadius + this.radius) {
            return 'star';
        }

        if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) {
            this.dx = -this.dx;
            this.x = Math.max(this.radius, Math.min(this.x, canvasWidth - this.radius));
        }

        if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) {
            this.dy = -this.dy;
            this.y = Math.max(this.radius, Math.min(this.y, canvasHeight - this.radius));
        }

        return 'none';
    }
}

let planets = [];
for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
    const dx = (Math.random() - 0.5) * 4;
    const dy = (Math.random() - 0.5) * 4;
    planets.push(new Planet(x, y, dx, dy, initialPlanetSize));
}

function drawStar() {
    ctx.beginPath();
    ctx.arc(canvasCenterX, canvasCenterY, starRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'yellow';
    ctx.fill();
}

function splitPlanet(planet) {
    const smallerPlanets = [];
    for (let i = 0; i < 4; i++) {
        const dx = (Math.random() - 0.5) * 4;
        const dy = (Math.random() - 0.5) * 4;
        if (planet.radius * 0.5 > 0.5)
            smallerPlanets.push(new Planet(planet.x, planet.y, dx, dy, planet.radius * 0.5));
    }
    return smallerPlanets;
}

function animate() {
    const currentTime = Date.now();
    // uncomment to save recording after some time
    // if (currentTime - startTime >= totalDuration) {
    //     stopRecording();
    //     return;
    // }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStar();

    for (let i = planets.length - 1; i >= 0; i--) {
        const planet = planets[i];
        const collision = planet.update();

        if (collision === 'star') {
            planets.splice(i, 1);
            continue;
        }

        for (let j = i - 1; j >= 0; j--) {
            const otherPlanet = planets[j];
            const dist = Math.sqrt((planet.x - otherPlanet.x) ** 2 + (planet.y - otherPlanet.y) ** 2);
            const canCollide = (currentTime - planet.lastCollision > collisionDelay) && (currentTime - otherPlanet.lastCollision > collisionDelay) && (planet.radius == otherPlanet.radius);
            if (dist < planet.radius + otherPlanet.radius && canCollide) {
                bounceSound.currentTime = 0;
                bounceSound.play();
                planet.lastCollision = currentTime;
                otherPlanet.lastCollision = currentTime;
                planets.splice(i, 1);
                planets.splice(j, 1);
                planets = planets.concat(splitPlanet(planet), splitPlanet(otherPlanet));
                break;
            }
        }

        planet.draw();
    }

    requestAnimationFrame(animate);
}

let recordedChunks = [];
const stream = canvas.captureStream(25);
const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

mediaRecorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
};

mediaRecorder.onstop = function () {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'canvas-animation.webm';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
};

function startRecording() {
    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
}

// startRecording();
animate();