/*

Copyright (c) 2026 Hannu_Hanhi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/



/*

Hi!

This is a hobby toy project so the code quality may not get a lot of attention.
Take a peek if you want, it's a bit messy though.

*/

"use strict";

var MAGNITUDE_LIMIT = 4;//0000000000000000;
var MAGNITUDE_LIMIT2 = 2.1;

var ITERATION_LIMIT = 2048;

var CR_MIN = -2.1;
var CI_MAX = 1.4;
var VIEW_SIZE = 2.8;

const workArray = Array(BOX_SIZE * BOX_SIZE).fill(0);

var frameRequested = false;
var mouseDown = false;
var mouseX = 0;
var mouseY = 0;

var arrowLeftHeld = false;
var arrowRightHeld = false;
var sliderValue = 30;
var arrowUpHeld = false;
var arrowDownHeld = false;
var sliderValue2 = 640;

const lpcount = navigator.hardwareConcurrency || 4;
const workerCount = Math.floor(lpcount * 1.5);//24;

const canvas = document.getElementById("output");
const WIDTH = Math.floor((window.innerWidth - 40) / 4) * 4; // needs to be divisible by 4
// needs to be divisible by PART_HEIGHT
const HEIGHT = Math.floor((window.innerHeight - 40) / PART_HEIGHT) * PART_HEIGHT;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const MIDDLE_X = WIDTH / 2 / HEIGHT;
document.title = "js fractal r1 " + WIDTH + " x " + HEIGHT + ", " + workerCount + " threads";
var PIXEL_INCREMENT = VIEW_SIZE / HEIGHT;
const ctx = canvas.getContext("2d");
ctx.font = "16px Arial";
//var imagePart = ctx.createImageData(WIDTH, PART_HEIGHT);

const overlay = document.getElementById("overlay-expanded");
overlay.style.display = "none";
var overlayShowing = false;

var currentFunction = mandelbrot;

//console.log("pre worker");
// worker array entry: [worker, imagePart, status, vpos]
// status: 0=idle, 1=working, 2=result ready
var workers = [];
var workerReady = true; // true when more work can be submitted
for (let i = 0; i < workerCount; i++) {
	// browser might fetch old worker on ctrl-f5. isn't that lovely?
	workers.push([new Worker("worker.js?v=2"), ctx.createImageData(WIDTH, PART_HEIGHT), 0, 0]);
	workers[i][0].onmessage = (e) => {
		workers[e.data[0]][1] = e.data[1];
		workers[e.data[0]][2] = 2;
		workerReady = true;
	}
}
//console.log("post worker")

function zoomIn() {
	var factor = 0.1 * (Math.min(lastTimeSum, 200) / 100);
	CR_MIN += mouseX * VIEW_SIZE * factor;
	CI_MAX -= mouseY * VIEW_SIZE * factor;
	VIEW_SIZE *= 1 - factor;
}

function zoomOut() {
	var factor = 0.1 * (Math.min(lastTimeSum, 400) / 100);
	CR_MIN -= mouseX * VIEW_SIZE * factor;
	CI_MAX += mouseY * VIEW_SIZE * factor;
	VIEW_SIZE *= 1 + factor;
}

function panView() {
	const xOffset = mouseX - MIDDLE_X;
	const yOffset = mouseY - 0.5;
	
	CR_MIN += xOffset * VIEW_SIZE;
	CI_MAX -= yOffset * VIEW_SIZE;
}

var currentMouseFunction = zoomIn;

var vpos = 0;
var timeSum = 0; // accumulating time spent on current picture
var lastTimeSum = 0; // the time sum from the previous picture

var drawBeginTime = 0;

var drawState = 0; // 0 = process input 1 = draw frame pieces
var piecesNeeded = 0;
var piecesDone = 0;
var workNeeded = true;

function draw() {
	frameRequested = false;
	
	if (drawState == 0) {
		if (mouseDown) {
			currentMouseFunction();
		}
		if (arrowLeftHeld && sliderValue > 0) sliderValue--;
		if (arrowRightHeld && sliderValue < 10000) sliderValue++;
		if (arrowDownHeld && sliderValue2 > 0) sliderValue2--;
		if (arrowUpHeld && sliderValue2 < 10000) sliderValue2++;
		
		MAGNITUDE_LIMIT = 1 + sliderValue * 0.1;
		MAGNITUDE_LIMIT2 = 1 + sliderValue2 * 0.1;
		
		PIXEL_INCREMENT = VIEW_SIZE / HEIGHT;
		
		workNeeded = true;
		piecesDone = 0;
		piecesNeeded = Math.floor(HEIGHT / PART_HEIGHT);
		workerReady = true;
		
		drawState = 1;
		drawBeginTime = performance.now();
	}
	
	/*var t = performance.now();
	//drawSlice();
	drawSliceOptimized();
	t = performance.now() - t;
	timeSum += t;*/
	
	// message: [thread id, imagedata, crMin, ciMax, viewSize, magLimit, sliderValue2, width, height
	// vpos, fractal name, iteration limit]
	
	if (workerReady) {
		for (let i = 0; i < workerCount; i++) {
			if (workers[i][2] == 2) {
				ctx.putImageData(workers[i][1], 0, workers[i][3])
				workers[i][2] = 0;
				piecesDone++;
			}
		}
		
		for (let i = 0; i < workerCount; i++) {
			if (workNeeded && workers[i][2] == 0) {
				workers[i][0].postMessage([i, workers[i][1], CR_MIN, CI_MAX, VIEW_SIZE, MAGNITUDE_LIMIT,
					sliderValue2, WIDTH, HEIGHT, vpos, currentFunctionName, ITERATION_LIMIT],
					[workers[i][1].data.buffer]);
				workers[i][3] = vpos;
				workers[i][2] = 1;
				vpos = (vpos + PART_HEIGHT) % HEIGHT;
				if (vpos == 0)
					workNeeded = false;
			}
		}
		
		if (piecesDone == piecesNeeded) {
			drawState = 0;
			lastTimeSum = performance.now() - drawBeginTime;
			
			if (mouseDown || arrowLeftHeld || arrowRightHeld || arrowDownHeld || arrowUpHeld) {
				requestAnimationFrame(draw);
				frameRequested = true;
			}
		} else {
			requestAnimationFrame(draw);
			frameRequested = true;
		}
		
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, 30, 40);
		ctx.fillStyle = "white";
		//ctx.fillText(Math.floor(t).toString(), 2, 16);
		ctx.fillText(Math.floor(lastTimeSum).toString(), 2, 36);
		
		workerReady = false;
	} else {
		requestAnimationFrame(draw);
		frameRequested = true;
	}
}

const fractalSelect = document.getElementById("fractal-select");
var currentFunctionName = "mandelbrot";
fractalSelect.value = currentFunctionName;

function switchFractal() {
	currentFunctionName = fractalSelect.value;
	if (currentFunctionName == "mandelbrot") {
		currentFunction = mandelbrot;
		CR_MIN = -2.1;
		CI_MAX = 1.4;
		VIEW_SIZE = 2.8;
	} else if (currentFunctionName == "tricorn") {
		currentFunction = tricorn;
		CR_MIN = -2.1;
		CI_MAX = 2;
		VIEW_SIZE = 4;
	} else if (currentFunctionName == "negate-cr") {
		currentFunction = negate_cr;
		CR_MIN = -2.1;
		CI_MAX = 1.4;
		VIEW_SIZE = 2.8;
	} else if (currentFunctionName == "negate-cr-ci") {
		currentFunction = negate_cr_ci;
		CR_MIN = -2.1;
		CI_MAX = 1.4;
		VIEW_SIZE = 2.8;
	} else if (currentFunctionName == "increment-zr") {
		currentFunction = increment_zr;
		CR_MIN = -2.1;
		CI_MAX = 1.4;
		VIEW_SIZE = 2.8;
	} else if (currentFunctionName == "burning-ship") {
		currentFunction = burningship;
		CR_MIN = -2.1;
		CI_MAX = 1.0;
		VIEW_SIZE = 2.8;
	}
	
	if (!frameRequested) {
		requestAnimationFrame(draw);
		frameRequested = true;
	}
}

fractalSelect.addEventListener("change", switchFractal);
document.getElementById("reset-view").addEventListener("click", switchFractal);

const iterationLimitSelect = document.getElementById("iteration-limit-select");
iterationLimitSelect.value = "L2048";

function switchIterationLimit() {
	if (iterationLimitSelect.value == "L2048")
		ITERATION_LIMIT = 2048;
	else if (iterationLimitSelect.value == "L1024")
		ITERATION_LIMIT = 1024;
	else if (iterationLimitSelect.value == "L256")
		ITERATION_LIMIT = 256;
	else if (iterationLimitSelect.value == "L128")
		ITERATION_LIMIT = 128;
	else if (iterationLimitSelect.value == "L80")
		ITERATION_LIMIT = 80;
	
	if (!frameRequested) {
		requestAnimationFrame(draw);
		frameRequested = true;
	}
}

iterationLimitSelect.addEventListener("change", switchIterationLimit);

document.getElementById("zoom-in").addEventListener("click",
	function() {currentMouseFunction = zoomIn;});
document.getElementById("zoom-out").addEventListener("click",
	function() {currentMouseFunction = zoomOut;});
document.getElementById("pan-view").addEventListener("click",
	function() {currentMouseFunction = panView;});

function zoomStart(e) {
	if (e.button === 0) {
		mouseDown = true;
		mouseX = e.offsetX / HEIGHT;
		mouseY = e.offsetY / HEIGHT;
		
		if (!frameRequested) {
			requestAnimationFrame(draw);
			frameRequested = true;
		}
	}
}

function zoomStop(e) {
	mouseDown = false;
}

function mouseMove(e) {
	mouseX = e.offsetX / HEIGHT;
	mouseY = e.offsetY / HEIGHT;
	
	if (e.offsetX < 1000 && e.offsetY < 50) {
		if (!overlayShowing) {
			overlay.style.display = "inline-block";
			overlayShowing = true;
		}
	} else {
		if (overlayShowing) {
			overlay.style.display = "none";
			overlayShowing = false;
		}
	}
}

canvas.addEventListener("mousedown", zoomStart);
canvas.addEventListener("mouseup", zoomStop);
canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mouseleave", zoomStop);

function keyDown(e) {// could just put e.key in a boolean in a dict
	if (e.key === "ArrowLeft") arrowLeftHeld = true;
	else if (e.key === "ArrowRight") arrowRightHeld = true;
	else if (e.key === "ArrowUp") arrowUpHeld = true;
	else if (e.key === "ArrowDown") arrowDownHeld = true;
	
	if (arrowLeftHeld || arrowRightHeld || arrowDownHeld || arrowUpHeld) {
		if (!frameRequested) {
			requestAnimationFrame(draw);
			frameRequested = true;
		}
	}
}

function keyUp(e) {
	if (e.key === "ArrowLeft") arrowLeftHeld = false;
	else if (e.key === "ArrowRight") arrowRightHeld = false;
	else if (e.key === "ArrowUp") arrowUpHeld = false;
	else if (e.key === "ArrowDown") arrowDownHeld = false;
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

draw();
