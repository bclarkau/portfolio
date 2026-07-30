var canvas = document.getElementById('spiro');
var context = canvas.getContext("2d");
var ident = 0;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const normalizeHue = (value) => ((value % 360) + 360) % 360;
const hsl = (h, s, l) => `hsl(${normalizeHue(h)} ${s}% ${l}%)`;
const hueDistance = (a, b) => Math.abs((((a - b) % 360) + 540) % 360 - 180);
const MIN_PRIMARY_SPIRO_HUE_DISTANCE = 160;
const MIN_SPIRO_BG_CONTRAST = 4.5;
const MIN_SPIRO_SAT = 86;
const MIN_SPIRO_LIGHTNESS = 40;
const MAX_SPIRO_LIGHTNESS = 60;

function avoidLowVisibilityHue(hue) {
	const normalized = normalizeHue(hue);
	return normalized >= 35 && normalized <= 85 ? normalizeHue(normalized + 90) : normalized;
}

function hslToRgb(h, s, l) {
	const hue = normalizeHue(h) / 360;
	const sat = s / 100;
	const light = l / 100;

	if (sat === 0) {
		const gray = Math.round(light * 255);
		return [gray, gray, gray];
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

	const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
	const p = 2 * light - q;
	return [
		Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
		Math.round(hueToRgb(p, q, hue) * 255),
		Math.round(hueToRgb(p, q, hue - 1 / 3) * 255)
	];
}

function relativeLuminance([r, g, b]) {
	const toLinear = (channel) => {
		const normalized = channel / 255;
		return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
	};

	const rl = toLinear(r);
	const gl = toLinear(g);
	const bl = toLinear(b);
	return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(rgbA, rgbB) {
	const l1 = relativeLuminance(rgbA);
	const l2 = relativeLuminance(rgbB);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

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
	spiroHue = avoidLowVisibilityHue(spiroHue);
	const backgroundRgb = hslToRgb(lightHue, lightSat, lightLightness);
	let spiroSat = randomInt(MIN_SPIRO_SAT, 98);
	let spiroLightness = randomInt(MIN_SPIRO_LIGHTNESS, MAX_SPIRO_LIGHTNESS);
	let spiroRgb = hslToRgb(spiroHue, spiroSat, spiroLightness);
	let spiroContrast = contrastRatio(spiroRgb, backgroundRgb);
	let attempts = 0;

	while (spiroContrast < MIN_SPIRO_BG_CONTRAST && attempts < 12) {
		spiroLightness = Math.max(MIN_SPIRO_LIGHTNESS, spiroLightness - 2);
		spiroSat = Math.min(98, spiroSat + 1);
		if (spiroLightness === MIN_SPIRO_LIGHTNESS) {
			spiroHue = normalizeHue(spiroHue + 25);
		}
		spiroRgb = hslToRgb(spiroHue, spiroSat, spiroLightness);
		spiroContrast = contrastRatio(spiroRgb, backgroundRgb);
		attempts += 1;
	}

	if (spiroContrast < MIN_SPIRO_BG_CONTRAST) {
		spiroHue = avoidLowVisibilityHue(primaryHue + 200);
		spiroSat = 98;
		spiroLightness = 44;
	}

	const darkRgbChannels = hslToRgb(darkHue, darkSat, darkLightness).join(', ');

	return {
		light: hsl(lightHue, lightSat, lightLightness),
		dark: hsl(darkHue, darkSat, darkLightness),
		primary: hsl(primaryHue, primarySat, primaryLightness),
		secondary: hsl(secondaryHue, secondarySat, secondaryLightness),
		primaryStrong: hsl(primaryHue, primarySat, Math.max(primaryLightness - 8, 40)),
		secondaryStrong: hsl(secondaryHue, secondarySat, Math.max(secondaryLightness - 10, 42)),
		muted: hsl(darkHue, Math.max(darkSat - 8, 12), Math.min(darkLightness + 34, 60)),
		spiro: hsl(spiroHue, spiroSat, spiroLightness),
		darkRgb: darkRgbChannels
	};
}

function applyPalette() {
	const palette = paletteFromWheel();

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
spirograph(options[Math.floor(Math.random() * options.length)], 0.1, 0.1, context)

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
