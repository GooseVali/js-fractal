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

// incoming message:
// [thread id, imagedata, crMin, ciMax, viewSize, magLimit, sliderValue2, width, height
// vpos, fractal name, iteration limit]

// outgoing message: [thread id, imagedata, time spent]

var imagePart, CR_MIN, CI_MAX, VIEW_SIZE, MAGNITUDE_LIMIT, sliderValue2, WIDTH, HEIGHT, vpos;
var ITERATION_LIMIT;

var PIXEL_INCREMENT;

importScripts("calculations.js");

var currentFunction = mandelbrot;

const workArray = Array(BOX_SIZE * BOX_SIZE).fill(0);

//console.log("in worker script");

onmessage = (e) => {
	imagePart = e.data[1];
	CR_MIN = e.data[2];
	CI_MAX = e.data[3];
	VIEW_SIZE = e.data[4];
	MAGNITUDE_LIMIT = e.data[5];
	sliderValue2 = e.data[6];
	WIDTH = e.data[7];
	HEIGHT = e.data[8];
	vpos = e.data[9];
	currentFunction = functionNames.get(e.data[10]);
	ITERATION_LIMIT = e.data[11];
	
	PIXEL_INCREMENT = VIEW_SIZE / HEIGHT;
	drawSliceOptimized();
	
	postMessage([e.data[0], imagePart, 1], [imagePart.data.buffer]);
};
