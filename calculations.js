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

const PART_HEIGHT = 64; // assumed to be same as BOX_SIZE for now
const BOX_SIZE = 64; // size of optimization boxes

const functionNames = new Map();
functionNames.set("mandelbrot", mandelbrot);
functionNames.set("tricorn", tricorn);
functionNames.set("negate-cr", negate_cr);
functionNames.set("negate-cr-ci", negate_cr_ci);
functionNames.set("increment-zr", increment_zr);
functionNames.set("burning-ship", burningship);

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
			//if (i % 4 == 0) {
			/*var temp = cr;
			cr = ci;
			ci = temp;*/
			//zi = Math.abs(zi);
			//}
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

function evaluateCurrentFunction(cr, ci) {
	return currentFunction(cr, ci);
}

function finalBox(x, y, cr_box, ci_box, size) {
	var arrayPos = x + 1 + (y + 1) * BOX_SIZE;
	
	var ci = ci_box - PIXEL_INCREMENT;
	for (let j = 1; j < size - 1; j++) {
		var cr = cr_box + PIXEL_INCREMENT;
		for (let i = 1; i < size - 1; i++) {
			workArray[arrayPos++] = evaluateCurrentFunction(cr, ci);
			cr += PIXEL_INCREMENT;
		}
		arrayPos += BOX_SIZE - (size - 2);
		ci -= PIXEL_INCREMENT;
	}
}

function compareLine(compareValue, arrayPos, length, vertical) {
	const stride = vertical ? BOX_SIZE : 1;
	for (let i = 0; i < length; i++) {
		if (workArray[arrayPos] != compareValue)
			return true;
		arrayPos += stride;
	}
	
	return false;
}

function drawLine(cr, ci, compareValue, arrayPos, length, vertical) {
	var foundChange = false;
	const stride = vertical ? BOX_SIZE : 1;
	const crIncrement = vertical ? 0 : PIXEL_INCREMENT;
	const ciIncrement = vertical ? PIXEL_INCREMENT : 0;
	for (let i = 0; i < length; i++) {
		const result = evaluateCurrentFunction(cr, ci);
		workArray[arrayPos] = result;
		arrayPos += stride;
		cr += crIncrement;
		ci -= ciIncrement;
		if (result != compareValue)
			foundChange = true;
	}
	return foundChange;
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
		foundChange = compareLine(compareValue, arrayPos, size - 1, false);
	} else {
		if (leftDone) {
			compareValue = workArray[arrayPos++];
		} else {
			const result = evaluateCurrentFunction(cr, ci);
			compareValue = result;
			workArray[arrayPos++] = result;
		}
		cr += PIXEL_INCREMENT;
		
		const length = rightDone ? size - 2 : size - 1;
		if (drawLine(cr, ci, compareValue, arrayPos, length, false))
			foundChange = true;
		
		if (rightDone && workArray[arrayPos + length] != compareValue)
			foundChange = true;
	}
	
	arrayPos = x + (y + 1) * BOX_SIZE;
	if (leftDone) {
		if (!foundChange) {
			foundChange = compareLine(compareValue, arrayPos, size - 2, true);
		}
	} else {
		cr = cr_box;
		ci = ci_box - PIXEL_INCREMENT;
		if (drawLine(cr, ci, compareValue, arrayPos, size - 2, true))
			foundChange = true;
	}
	
	arrayPos = x + size - 1 + (y + 1) * BOX_SIZE;
	if (rightDone) {
		if (!foundChange) {
			foundChange = compareLine(compareValue, arrayPos, size - 2, true);
		}
	} else {
		cr = cr_box + (size - 1) * PIXEL_INCREMENT;
		ci = ci_box - PIXEL_INCREMENT;
		if (drawLine(cr, ci, compareValue, arrayPos, size - 2, true))
			foundChange = true;
	}
	
	arrayPos = x + (y + size - 1) * BOX_SIZE;
	if (bottomDone) {
		if (!foundChange) {
			foundChange = compareLine(compareValue, arrayPos, size, false);
		}
	} else {
		cr = cr_box;
		ci = ci_box - (size - 1) * PIXEL_INCREMENT;
		var length = rightDone ? size - 1 : size;
		
		if (leftDone) {
			if (workArray[arrayPos++] != compareValue) foundChange = true;
			cr += PIXEL_INCREMENT;
			length--;
		}
		
		if (drawLine(cr, ci, compareValue, arrayPos, length, false))
			foundChange = true;
		
		if (rightDone && workArray[arrayPos + length] != compareValue)
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

function writePixelColor(value, position) {
	//if (value > 0) {
	//value += Math.random() - 0.5;
	//value = Math.floor(value * 6) + 19;
	//value = Math.floor(value * 3) + 17;
	//value = value * 2 + 1;
	//}
	
	if (ITERATION_LIMIT == 80) {
		value = value * 3 + 17;
	} else if (ITERATION_LIMIT == 128) {
		value = value * 2 + 1;
	}

	if (value < 256) {
		imagePart.data[position] = value;
		imagePart.data[position + 1] = value;
		imagePart.data[position + 2] = value;
	} else if (value < 512) {
		imagePart.data[position] = value - 256;
		imagePart.data[position + 1] = 0;
		imagePart.data[position + 2] = 0;
	} else if (value < 768) {
		imagePart.data[position] = 0;
		imagePart.data[position + 1] = value - 512;
		imagePart.data[position + 2] = 0;
	} else if (value < 1024) {
		imagePart.data[position] = 0;
		imagePart.data[position + 1] = 0;
		imagePart.data[position + 2] = value - 768;
	} else if (value < 1280) {
		imagePart.data[position] = Math.floor((value - 1024) * 0.5);
		imagePart.data[position + 1] = 0;
		imagePart.data[position + 2] = value - 1024;
	} else if (value < 1536) {
		imagePart.data[position] = 0;
		imagePart.data[position + 1] = value - 1280;
		imagePart.data[position + 2] = value - 1280;
	} else if (value < 1792) {
		imagePart.data[position] = value - 1536;
		imagePart.data[position + 1] = 0;
		imagePart.data[position + 2] = value - 1536;
	} else {
		imagePart.data[position] = value - 1792;
		imagePart.data[position + 1] = value - 1792;
		imagePart.data[position + 2] = 0;
	}

	imagePart.data[position + 3] = 255;
}

function workArrayToImage(imagePos, size) {
	var arrayPos = 0;
	
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			var value = workArray[arrayPos++];
			writePixelColor(value, imagePos);
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
			var result = evaluateCurrentFunction(cr, ci);
			//if (result > 0) {
				//result += Math.random() - 0.5;
				//result = Math.floor(result * 12) + 22;
				//result = Math.floor(result * 6) + 19;
				//result = Math.floor(result * 3) + 17;
				//result = result * 2 + 1;
			//}

			writePixelColor(result, i);

			cr += PIXEL_INCREMENT;
			i += 4;
		}
		ci -= PIXEL_INCREMENT;
	}
}
