
import { css } from "emotion";

const StyledCanvas = css`
  canvas {
      box-sizing: border-box;
      border: 2px solid #2e4c9d;
      margin: 0;
      background: linear-gradient(-45deg, #ea4630, #0aae9f, #777ba6, #F8B229);
      background-size: 400% 400%;
      animation: gradientBackground 5s ease infinite;
}

@keyframes gradientBackground {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
`;

    let canvas;
    let context;
    let images = new Object();
    let totalResources = 5;
    let numResourcesLoaded = 0;
    let fps = 30;
    let x = 75;
    let y = 175;
    let breathInc = 0.1;
    let breathDir = 1;
    let breathAmt = 0;
    let breathMax = 2;
    let breathInterval = setInterval(updateBreath, 1000 / fps);
    let maxEyeHeight = 14;
    let curEyeHeight = maxEyeHeight;
    let eyeOpenTime = 0;
    let timeBtwBlinks = 4000;
    let blinkUpdateTime = 200;
    let blinkTimer = setInterval(updateBlink, blinkUpdateTime);
    let fpsInterval = setInterval(updateFPS, 1000);
    let numFramesDrawn = 0;
    let curFPS = 0;


    function updateFPS() {
        curFPS = numFramesDrawn;
        numFramesDrawn = 0;
    }

    function prepareCanvas(canvasDiv, canvasWidth, canvasHeight) {
        // IE FALLBACK :(
        canvas = document.createElement('canvas');
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        canvas.setAttribute('id', 'canvas');
        canvas.classList.add(StyledCanvas);
        canvasDiv.appendChild(canvas);

        if (typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        context = canvas.getContext("2d");
        loadImage("leftArm");
        loadImage("torso");
        loadImage("rightArm");
        loadImage("head");
        loadImage("hat");
    }

    function loadImage(name) {
        images[name] = new Image();
        images[name].onload = function () {
            resourceLoaded();
        }
        images[name].src = `../images/${name}.png`;
    }

    function resourceLoaded() {
        numResourcesLoaded += 1;
        if (numResourcesLoaded === totalResources) {

            setInterval(redraw, 1000 / fps);
        }
    }

    function redraw() {
        canvas.width = canvas.width; // clears the canvas
        drawEllipse(x + 21, y + 19, 165 - breathAmt, 6, 'rgba(235,232,223, 0.3)'); // Shadow
        context.drawImage(images["leftArm"], x + 12, y - 40 - breathAmt);
        context.drawImage(images["torso"], x - 75, y - 60);
        context.drawImage(images["head"], x - 10, y - 125 - breathAmt);
        context.drawImage(images["hat"], x - 18, y - 178 - breathAmt);
        context.drawImage(images["rightArm"], x - 38, y - 36 - breathAmt);

        drawEllipse(x + 47, y - 68 - breathAmt, 8, curEyeHeight, '#252826'); // Left Eye
        drawEllipse(x + 58, y - 68 - breathAmt, 8, curEyeHeight, '#252826'); // Right Eye
    }

    function drawEllipse(centerX, centerY, width, height, color) {

        context.beginPath();

        context.moveTo(centerX, centerY - height / 2);
        context.bezierCurveTo(
            centerX + width / 2, centerY - height / 2,
            centerX + width / 2, centerY + height / 2,
            centerX, centerY + height / 2);

        context.bezierCurveTo(
            centerX - width / 2, centerY + height / 2,
            centerX - width / 2, centerY - height / 2,
            centerX, centerY - height / 2);

        context.fillStyle = color;
        context.fill();
        context.closePath();
    }

    function updateBreath() {
        if (breathDir === 1) { // breath in
            breathAmt -= breathInc;
            if (breathAmt < -breathMax) {
                breathDir = -1;
            }
        } else { // breath out
            breathAmt += breathInc;
            if (breathAmt > breathMax) {
                breathDir = 1;
            }
        }
    }

    function updateBlink() {

        eyeOpenTime += blinkUpdateTime;

        if (eyeOpenTime >= timeBtwBlinks) {
            blink();
        }
    }

    function blink() {
        curEyeHeight -= 1;
        if (curEyeHeight <= 0) {
            eyeOpenTime = 0;
            curEyeHeight = maxEyeHeight;
        } else {
            setTimeout(blink, 10);
        }
    }
   canvasDiv.classList.add(StyledCanvas);
   prepareCanvas(document.getElementById("canvasDiv"), 200, 200);