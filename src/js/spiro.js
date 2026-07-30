var canvas = document.getElementById('spiro');
var context = canvas.getContext("2d");
var ident = 0;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const normalizeHue = (value) => ((value % 360) + 360) % 360;
const hsl = (h, s, l) => `hsl(${normalizeHue(h)} ${s}% ${l}%)`;
const hueDistance = (a, b) => Math.abs((((a - b) % 360) + 540) % 360 - 180);
const MIN_PRIMARY_SPIRO_HUE_DISTANCE = 160;

function paletteFromWheel() {
	const baseHue = randomInt(0, 359);
	const schemes = [
		[0, 28],
		[0, -28],
		[0, 150],
		[0, 210],
		[0, 120],
		[0, 240]
	];
	const [primaryShift, secondaryShift] = schemes[randomInt(0, schemes.length - 1)];

	const primaryHue = normalizeHue(baseHue + primaryShift);
	const secondaryHue = normalizeHue(baseHue + secondaryShift);
	const darkHue = normalizeHue(baseHue + randomInt(-20, 20));
	const paperHue = randomInt(34, 56);
	const lightHueOffset = ((baseHue - paperHue + 540) % 360) - 180;
	const lightHue = normalizeHue(paperHue + Math.max(-10, Math.min(10, Math.round(lightHueOffset * 0.15))));

	const darkSat = randomInt(18, 30);
	const darkLightness = randomInt(14, 20);
	const lightSat = randomInt(16, 28);
	const lightLightness = randomInt(94, 97);
	const primarySat = randomInt(70, 86);
	const primaryLightness = randomInt(50, 58);
	const secondarySat = randomInt(62, 80);
	const secondaryLightness = randomInt(58, 68);

	let spiroHue = normalizeHue(primaryHue + 180 + randomInt(-12, 12));
	if (hueDistance(spiroHue, primaryHue) < MIN_PRIMARY_SPIRO_HUE_DISTANCE) {
		spiroHue = normalizeHue(primaryHue + 180);
	}
	const spiroSat = randomInt(78, 92);
	const spiroLightness = randomInt(62, 76);

	return {
		light: hsl(lightHue, lightSat, lightLightness),
		dark: hsl(darkHue, darkSat, darkLightness),
		primary: hsl(primaryHue, primarySat, primaryLightness),
		secondary: hsl(secondaryHue, secondarySat, secondaryLightness),
		primaryStrong: hsl(primaryHue, primarySat, Math.max(primaryLightness - 8, 40)),
		secondaryStrong: hsl(secondaryHue, secondarySat, Math.max(secondaryLightness - 10, 42)),
		muted: hsl(darkHue, Math.max(darkSat - 8, 12), Math.min(darkLightness + 34, 60)),
		spiro: hsl(spiroHue, spiroSat, spiroLightness),
		darkRgb: '42, 31, 22'
	};
}

function hslToRgbChannels(hslString) {
	const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
	if (!match) return '42, 31, 22';

	const h = Number(match[1]) / 360;
	const s = Number(match[2]) / 100;
	const l = Number(match[3]) / 100;

	if (s === 0) {
		const gray = Math.round(l * 255);
		return `${gray}, ${gray}, ${gray}`;
	}

	const hueToRgb = (p, q, t) => {
		let temp = t;
		if (temp < 0) temp += 1;
		if (temp > 1) temp -= 1;
		if (temp < 1 / 6) return p + (q - p) * 6 * temp;
		if (temp < 1 / 2) return q;
		if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
		return p;
	};

	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	const r = Math.round(hueToRgb(p, q, h + 1 / 3) * 255);
	const g = Math.round(hueToRgb(p, q, h) * 255);
	const b = Math.round(hueToRgb(p, q, h - 1 / 3) * 255);

	return `${r}, ${g}, ${b}`;
}

function applyPalette() {
	const palette = paletteFromWheel();
	palette.darkRgb = hslToRgbChannels(palette.dark);

	const rootStyle = document.documentElement.style;
	rootStyle.setProperty('--light', palette.light);
	rootStyle.setProperty('--dark', palette.dark);
	rootStyle.setProperty('--primary', palette.primary);
	rootStyle.setProperty('--secondary', palette.secondary);
	rootStyle.setProperty('--primary-strong', palette.primaryStrong);
	rootStyle.setProperty('--secondary-strong', palette.secondaryStrong);
	rootStyle.setProperty('--muted', palette.muted);
	rootStyle.setProperty('--dark-rgb', palette.darkRgb);
	rootStyle.setProperty('--spiro-stroke', palette.spiro);
}

applyPalette();

// resize canvas
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// preset spiropgraphs
const options = [
	{ a: 176, b: 78, c1: 128, c2: 128 },
	{ a: 89, b: 152, c1: 67, c2: 67 },
	{ a: 23, b: 105, c1: 127, c2: 127 },
	{ a: 184, b: 113, c1: 45, c2: 45 },
	{ a: 78, b: 70, c1: 174, c2: 174 },
	{ a: 177, b: 76, c1: 120, c2: 120 },
	{ a: 189, b: 111, c1: 7, c2: 7 }
]

// start drawing
draw(Math.floor(Math.random() * options.length), context)

// draw a spirograph from options
function draw(key, context, random = false) {
	const params = random ? getRandomParams() : options[key]
	// console.log(params)
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
	context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--spiro-stroke').trim() || '#ffffff'

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
