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

const ITERATION_LIMIT = 80; // pixel color calculation assumes this is 80 currently!
var MAGNITUDE_LIMIT = 4;//0000000000000000;
var MAGNITUDE_LIMIT2 = 2.1;

const PART_HEIGHT = 128; // assumed to be same as BOX_SIZE for now
const BOX_SIZE = 128; // size of optimization boxes

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

const canvas = document.getElementById("output");
const WIDTH = Math.floor((window.innerWidth - 40) / 4) * 4; // needs to be divisible by 4
// needs to be divisible by PART_HEIGHT
const HEIGHT = Math.floor((window.innerHeight - 40) / PART_HEIGHT) * PART_HEIGHT;
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.title = "js fractal r1 " + WIDTH + " x " + HEIGHT;
var PIXEL_INCREMENT = VIEW_SIZE / HEIGHT;
const ctx = canvas.getContext("2d");
ctx.font = "16px Arial";
const imagePart = ctx.createImageData(WIDTH, PART_HEIGHT);

const overlay = document.getElementById("overlay-expanded");
overlay.style.display = "none";
var overlayShowing = false;

function mandelbrot(cr, ci) {
	var zr = 0;
	var zi = 0;
	var zr2 = 0; // squared
	var zi2 = 0; // squared
	var magnitude = 0;
	var i;

	for (i = 0; i < ITERATION_LIMIT; i++) {
		if (magnitude < MAGNITUDE_LIMIT/*zr < MAGNITUDE_LIMIT && // what about separate magnitude limits for each of these?
				-zr < MAGNITUDE_LIMIT2 &&
				zi < MAGNITUDE_LIMIT &&
				-zi < MAGNITUDE_LIMIT2*/) {
			zi = zr * zi;
			zi += zi + ci;
			zr = zr2 - zi2 + cr;
			zr2 = zr * zr;
			zi2 = zi * zi;
			magnitude = zr2 + zi2;
			
			//cr *= -1;
			//ci *= -1;
			
			//zr += 0.01 * i;
			
			//zr += 0.0001 * sliderValue2 * i;
		} else break;
	}

	return i == ITERATION_LIMIT ? 0 : i;
}

function tricorn(cr, ci) {
	var zr = 0; var zi = 0;
	var zr2 = 0; var zi2 = 0; // squared
	var magnitude = 0; var i;

	for (i = 0; i < ITERATION_LIMIT; i++) {
		if (magnitude < MAGNITUDE_LIMIT) {
			ci *= -1;
			
			zi = zr * zi;
			zi += zi + ci;
			zr = zr2 - zi2 + cr;
			zr2 = zr * zr;
			zi2 = zi * zi;
			magnitude = zr2 + zi2;
		} else break;
	}

	return i == ITERATION_LIMIT ? 0 : i;
}

function negate_cr(cr, ci) {
	var zr = 0; var zi = 0;
	var zr2 = 0; var zi2 = 0; // squared
	var magnitude = 0; var i;

	for (i = 0; i < ITERATION_LIMIT; i++) {
		if (magnitude < MAGNITUDE_LIMIT) {
			cr *= -1;
			
			zi = zr * zi;
			zi += zi + ci;
			zr = zr2 - zi2 + cr;
			zr2 = zr * zr;
			zi2 = zi * zi;
			magnitude = zr2 + zi2;
		} else break;
	}

	return i == ITERATION_LIMIT ? 0 : i;
}

function negate_cr_ci(cr, ci) {
	var zr = 0; var zi = 0;
	var zr2 = 0; var zi2 = 0; // squared
	var magnitude = 0; var i;

	for (i = 0; i < ITERATION_LIMIT; i++) {
		if (magnitude < MAGNITUDE_LIMIT) {
			cr *= -1;
			ci *= -1;
			
			zi = zr * zi;
			zi += zi + ci;
			zr = zr2 - zi2 + cr;
			zr2 = zr * zr;
			zi2 = zi * zi;
			magnitude = zr2 + zi2;
		} else break;
	}

	return i == ITERATION_LIMIT ? 0 : i;
}

function increment_zr(cr, ci) {
	var zr = 0; var zi = 0;
	var zr2 = 0; var zi2 = 0; // squared
	var magnitude = 0; var i;

	for (i = 0; i < ITERATION_LIMIT; i++) {
		if (magnitude < MAGNITUDE_LIMIT) {
			zr += 0.01 * i;
			
			zi = zr * zi;
			zi += zi + ci;
			zr = zr2 - zi2 + cr;
			zr2 = zr * zr;
			zi2 = zi * zi;
			magnitude = zr2 + zi2;
		} else break;
	}

	return i == ITERATION_LIMIT ? 0 : i;
}

function burningship(cr, ci) {
	var zr = 0; var zi = 0;
	var zr2 = 0; var zi2 = 0; // squared
	var magnitude = 0; var i;

	for (i = 0; i < ITERATION_LIMIT; i++) {
		if (magnitude < MAGNITUDE_LIMIT) {
			zi = zr * zi;
			zi += zi + ci;
			zr = zr2 - zi2 + cr;
			zr = Math.abs(zr);
			zi = Math.abs(zi);
			zr2 = zr * zr;
			zi2 = zi * zi;
			magnitude = zr2 + zi2;
		} else break;
	}

	return i == ITERATION_LIMIT ? 0 : i;
}

var currentFunction = mandelbrot;

function finalBox(x, y, cr_box, ci_box, size) {
	var arrayPos = x + 1 + (y + 1) * BOX_SIZE;
	
	var ci = ci_box - PIXEL_INCREMENT;
	for (let j = 1; j < size - 1; j++) {
		var cr = cr_box + PIXEL_INCREMENT;
		for (let i = 1; i < size - 1; i++) {
			workArray[arrayPos++] = currentFunction(cr, ci);
			cr += PIXEL_INCREMENT;
		}
		arrayPos += BOX_SIZE - (size - 2);
		ci -= PIXEL_INCREMENT;
	}
}

// draw to workArray
function drawBox(x, y, cr_box, ci_box, size, topDone, leftDone, rightDone, bottomDone) {
	var cr = cr_box;
	var ci = ci_box;
	var arrayPos = x + y * BOX_SIZE;
	var foundChange = false;
	var compareValue = -1;
	
	if (topDone) {
		compareValue = workArray[arrayPos++];
		for (let i = 1; i < size; i++) {
			if (workArray[arrayPos++] != compareValue) {
				foundChange = true;
				break; // no need to read the rest anymore
			}
		}
	} else {
		var rightEdge = rightDone ? size - 1 : size; // exclusive
		if (leftDone) {
			compareValue = workArray[arrayPos++];
		} else {
			const result = currentFunction(cr, ci);
			compareValue = result;
			workArray[arrayPos++] = result;
		}
		cr += PIXEL_INCREMENT;
		
		for (let i = 1; i < rightEdge; i++) {
			const result = currentFunction(cr, ci);
			workArray[arrayPos++] = result;
			if (result != compareValue) foundChange = true;
			
			cr += PIXEL_INCREMENT;
		}
		
		if (rightDone && workArray[arrayPos] != compareValue)
			foundChange = true;
	}
	
	arrayPos = x + (y + 1) * BOX_SIZE;
	if (leftDone) {
		if (!foundChange) {
			for (let i = 1; i < size - 1; i++) {
				if (workArray[arrayPos] != compareValue) {
					foundChange = true;
					break;
				}
				arrayPos += BOX_SIZE;
			}
		}
	} else {
		cr = cr_box;
		ci = ci_box - PIXEL_INCREMENT;
		for (let i = 1; i < size - 1; i++) {
			const result = currentFunction(cr, ci);
			workArray[arrayPos] = result;
			if (result != compareValue) foundChange = true;
			
			arrayPos += BOX_SIZE;
			ci -= PIXEL_INCREMENT;
		}
	}
	
	arrayPos = x + size - 1 + (y + 1) * BOX_SIZE;
	if (rightDone) {
		if (!foundChange) {
			for (let i = 1; i < size - 1; i++) {
				if (workArray[arrayPos] != compareValue) {
					foundChange = true;
					break;
				}
				arrayPos += BOX_SIZE;
			}
		}
	} else {
		cr = cr_box + (size - 1) * PIXEL_INCREMENT;
		ci = ci_box - PIXEL_INCREMENT;
		for (let i = 1; i < size - 1; i++) {
			const result = currentFunction(cr, ci);
			workArray[arrayPos] = result;
			if (result != compareValue) foundChange = true;
			
			arrayPos += BOX_SIZE;
			ci -= PIXEL_INCREMENT;
		}
	}
	
	arrayPos = x + (y + size - 1) * BOX_SIZE;
	if (bottomDone) {
		if (!foundChange) {
			for (let i = 0; i < size; i++) {
				if (workArray[arrayPos++] != compareValue) {
					foundChange = true;
					break;
				}
			}
		}
	} else {
		cr = cr_box;
		ci = ci_box - (size - 1) * PIXEL_INCREMENT;
		var leftEdge = leftDone ? 1 : 0;
		var rightEdge = rightDone ? size - 1 : size; // exclusive
		
		if (leftDone) {
			if (workArray[arrayPos++] != compareValue) foundChange = true;
			cr += PIXEL_INCREMENT;
		}
		
		for (let i = leftEdge; i < rightEdge; i++) {
			const result = currentFunction(cr, ci);
			workArray[arrayPos++] = result;
			if (result != compareValue) foundChange = true;
			
			cr += PIXEL_INCREMENT;
		}
		
		if (rightDone && workArray[arrayPos] != compareValue)
			foundChange = true;
	}
	
	if (foundChange) {
		const nextSize = size / 2;
		if (nextSize == 2) {
			finalBox(x, y, cr_box, ci_box, size);
		} else {
			// top left
			drawBox(x, y, cr_box, ci_box, nextSize, true, true, false, false);
			// top right
			drawBox(x + nextSize, y, cr_box + nextSize * PIXEL_INCREMENT, ci_box, nextSize,
				true, false, true, false);
			// bottom left
			drawBox(x, y + nextSize, cr_box, ci_box - nextSize * PIXEL_INCREMENT, nextSize,
				false, true, false, true);
			// bottom right
			drawBox(x + nextSize, y + nextSize, cr_box + nextSize * PIXEL_INCREMENT,
				ci_box - nextSize * PIXEL_INCREMENT, nextSize, false, false, true, true);
		}
	} else {
		arrayPos = x + 1 + (y + 1) * BOX_SIZE;
		for (let j = 1; j < size - 1; j++) {
			for (let i = 1; i < size - 1; i++) {
				workArray[arrayPos++] = compareValue;
			}
			arrayPos += BOX_SIZE - (size - 2);
		}
	}
}

function workArrayToImage(imagePos, size) {
	var arrayPos = 0;
	
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			var value = workArray[arrayPos++];
			if (value > 0) {
				//value += Math.random() - 0.5;
				//value = Math.floor(value * 6) + 19;
				value = Math.floor(value * 3) + 17;
			}
				
			imagePart.data[imagePos] = value;
			imagePart.data[imagePos + 1] = value;
			imagePart.data[imagePos + 2] = value;
			imagePart.data[imagePos + 3] = 255;
			
			imagePos += 4;
		}
		arrayPos += BOX_SIZE - size;
		imagePos += (WIDTH - size) * 4;
	}
}

function drawSliceOptimized() {
	// real part, from pixel x-coordinate
	var cr = CR_MIN;
	// imaginary part, from pixel y-coordinate
	var ci = CI_MAX - vpos * PIXEL_INCREMENT;
	
	var boxX;
	for (boxX = 0; boxX < WIDTH - BOX_SIZE; boxX += BOX_SIZE) {
		drawBox(0, 0, cr, ci, BOX_SIZE, false, false, false, false);
		workArrayToImage(boxX * 4, BOX_SIZE);
		cr += BOX_SIZE * PIXEL_INCREMENT;
	}
	
	boxX -= BOX_SIZE;
	cr -= BOX_SIZE * PIXEL_INCREMENT;
	var remainderBox = BOX_SIZE;
	var remainder = WIDTH - boxX;
	while (remainder > 3) {
		while (remainderBox > remainder)
			remainderBox /= 2;
		
		ci = CI_MAX - vpos * PIXEL_INCREMENT;
		var imagePos = boxX * 4;
		for (let boxY = 0; boxY < BOX_SIZE; boxY += remainderBox) {
			drawBox(0, 0, cr, ci, remainderBox, false, false, false, false);
			workArrayToImage(imagePos, remainderBox);
			imagePos += WIDTH * remainderBox * 4;
			ci -= remainderBox * PIXEL_INCREMENT;
		}
		
		boxX += remainderBox;
		cr += remainderBox * PIXEL_INCREMENT;
		remainder -= remainderBox;
	}
}

function drawSlice() {
	// imaginary part, from pixel y-coordinate
	var ci = CI_MAX - vpos * PIXEL_INCREMENT;
	
	var i = 0;
	for (let y = 0; y < PART_HEIGHT; y++) {
		var cr = CR_MIN; // real part, from pixel x-coordinate
		for (let x = 0; x < WIDTH; x++) {
			var result = currentFunction(cr, ci);
			if (result > 0) {
				//result += Math.random() - 0.5;
				//result = Math.floor(result * 12) + 22;
				//result = Math.floor(result * 6) + 19;
				result = Math.floor(result * 3) + 17;
			}

			cr += PIXEL_INCREMENT;

			imagePart.data[i] = result;
			imagePart.data[i + 1] = result;
			imagePart.data[i + 2] = result;
			imagePart.data[i + 3] = 255;
			i += 4;
		}
		ci -= PIXEL_INCREMENT;
	}
}

var vpos = 0;
var timeSum = 0; // accumulating time spent on current picture
var lastTimeSum = 0; // the time sum from the previous picture

function draw() {
	frameRequested = false;
	
	PIXEL_INCREMENT = VIEW_SIZE / HEIGHT;
	
	var t = performance.now();
	//drawSlice();
	drawSliceOptimized();
	t = performance.now() - t;
	timeSum += t;
	
	ctx.putImageData(imagePart, 0, vpos);
	
	vpos = (vpos + PART_HEIGHT) % HEIGHT;
	if (vpos == 0) {
		/*VIEW_SIZE -= 0.0025;
		CI_MAX -= 0.00125;
		//MAGNITUDE_LIMIT += 0.01;
		MAGNITUDE_LIMIT += 10;*/
		
		lastTimeSum = timeSum;
		timeSum = 0;
		
		if (mouseDown || arrowLeftHeld || arrowRightHeld || arrowDownHeld || arrowUpHeld) {
			requestAnimationFrame(draw);
			frameRequested = true;
		}
		
		if (mouseDown) {
			CR_MIN += mouseX * VIEW_SIZE * 0.1;
			CI_MAX -= mouseY * VIEW_SIZE * 0.1;
			VIEW_SIZE *= 0.9;
		}
		if (arrowLeftHeld && sliderValue > 0) sliderValue--;
		if (arrowRightHeld && sliderValue < 10000) sliderValue++;
		if (arrowDownHeld && sliderValue2 > 0) sliderValue2--;
		if (arrowUpHeld && sliderValue2 < 10000) sliderValue2++;
		
		MAGNITUDE_LIMIT = 1 + sliderValue * 0.1;
		MAGNITUDE_LIMIT2 = 1 + sliderValue2 * 0.1;
	} else {
		requestAnimationFrame(draw);
		frameRequested = true;
	}
	
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 30, 40);
	ctx.fillStyle = "white";
	ctx.fillText(Math.floor(t).toString(), 2, 16);
	ctx.fillText(Math.floor(lastTimeSum).toString(), 2, 36);
}

const fractalSelect = document.getElementById("fractal-select");
fractalSelect.value = "mandelbrot";

function switchFractal() {
	if (fractalSelect.value == "mandelbrot") {
		currentFunction = mandelbrot;
		CR_MIN = -2.1;
		CI_MAX = 1.4;
		VIEW_SIZE = 2.8;
	} else if (fractalSelect.value == "tricorn") {
		currentFunction = tricorn;
		CR_MIN = -2.1;
		CI_MAX = 2;
		VIEW_SIZE = 4;
	} else if (fractalSelect.value == "negate-cr") {
		currentFunction = negate_cr;
		CR_MIN = -2.1;
		CI_MAX = 1.4;
		VIEW_SIZE = 2.8;
	} else if (fractalSelect.value == "negate-cr-ci") {
		currentFunction = negate_cr_ci;
		CR_MIN = -2.1;
		CI_MAX = 1.4;
		VIEW_SIZE = 2.8;
	} else if (fractalSelect.value == "increment-zr") {
		currentFunction = increment_zr;
		CR_MIN = -2.1;
		CI_MAX = 1.4;
		VIEW_SIZE = 2.8;
	} else if (fractalSelect.value == "burning-ship") {
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
	
	if (e.offsetX < 400 && e.offsetY < 50) {
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
