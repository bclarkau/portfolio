var canvas = document.getElementById('spiro');
var context = canvas.getContext("2d");
var ident = 0;

// resize canvas
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// preset spiropgraphs
const options = [
	{ a: 176, b: 78, c1: 128, c2: 128 },
	{ a: 89, b: 52, c1: 67, c2: 67 },
	{ a: 93, b: 21, c1: 57, c2: 57 },
	{ a: 54, b: 133, c1: 11, c2: 11 },
	{ a: 78, b: 70, c1: 174, c2: 174 },
	{ a: 177, b: 76, c1: 120, c2: 120 },
	{ a: 189, b: 111, c1: 7, c2: 7 }
]

// start drawing
draw(0, context, true)

// draw a spirograph from options
function draw(key, context, random = false) {
	const params = random ? getRandomParams() : options[key]
	console.log(params)
	spirograph(params, 0.1, 0.1, context)
}

// generate random spirograph params
function getRandomParams() {
	const a = Math.floor(Math.random() * Math.floor(200))
	const b = Math.floor(Math.random() * Math.floor(140))
	const c1 = Math.floor(Math.random() * Math.floor(200))
	const c2 = c1 // keep these the same to preserve circular spirograph
	return { a, b, c1, c2 }
}

// draw animated spirograph
function spirograph(params, tRatio, resolution, context) {
	const { a, b, c1, c2 } = params

	const getCoords = (t) => ([
		cx + ((a + b) * Math.cos(t) - (b + c1) * Math.cos(((a + b) / b) * t)),
		cy - ((a + b) * Math.sin(t) - (b + c2) * Math.sin(((a + b) / b) * t))	
	])

	var cx = canvas.width / 2;
	var cy = canvas.height / 2;
	context.clearRect(0, 0, canvas.width, canvas.height);

	var [ox, oy] = getCoords(0)

	var i = 0;
	var myIdent = ++ident;
	context.lineCap = 'round'
	context.lineWidth = 2
	context.strokeStyle = 'white'

	const step = () => {
		if (ident != myIdent) return;

		context.beginPath();
		context.moveTo(ox, oy);

		var [x, y] = getCoords(tRatio * i)

		ox = x;
		oy = y;
		context.lineTo(x, y);
		context.stroke();
		i = i + resolution
		if (i < 500) window.requestAnimationFrame(step);
	}

	step()

}

// Draw static spirograph (no animation)
// function spirographStatic(a, b, c1, c2, tRatio, resolution, context) {

// 	var cx = canvas.width / 2;
// 	var cy = canvas.height / 2;
// 	context.clearRect(0, 0, canvas.width, canvas.height);
// 	context.moveTo(cx, cy);
// 	context.beginPath();

// 	for (var i = 1; i < 100; i++) {

// 		let t = tRatio * i;
// 		let x = cx + ((a + b) * Math.cos(t) - (b + c1) * Math.cos(((a + b) / b) * t));
// 		let y = cy - ((a + b) * Math.sin(t) - (b + c2) * Math.sin(((a + b) / b) * t));

// 		context.lineTo(x, y);
// 		context.strokeStyle = "#000";
// 		context.stroke();
// 	}
// }
