var pow = Math.pow;
var round = Math.round;
var sqrt = Math.sqrt;
var PI = Math.PI;
var abs = Math.abs;
var ceil = Math.ceil;
var floor = Math.floor;
var sin = Math.sin;
var cos = Math.cos;
var min = Math.min;
var max = Math.max;
var random = Math.random;
var E = Math.E;

var __exch = /\(([^\s]+)\s+([a-zA-Z]{1,5})\s+(?:in|to)\s+([a-zA-Z]{1,5})\)/;
var __rates = {
			    ['ft/inch']: 12.0,
			    ['ft/mile']: 0.0001893939393939394,
			    ['ft/m']: 0.3048,
			    ['ft/km']: 0.0003048,
			    ['inch/ft']: 0.08333333333333333,
			    ['inch/mile']: 1.5782828282828283e-05,
			    ['inch/m']: 0.0254,
			    ['inch/km']: 2.54e-05,
			    ['mile/ft']: 5280.0,
			    ['mile/inch']: 63360.0,
			    ['mile/m']: 1609.344,
			    ['mile/km']: 1.6093439999999999,
			    ['m/ft']: 3.2808398950131235,
			    ['m/inch']: 39.37007874015748,
			    ['m/mile']: 0.000621371192237334,
			    ['m/km']: 0.001,
			    ['km/ft']: 3280.839895013123,
			    ['km/inch']: 39370.07874015748,
			    ['km/mile']: 0.621371192237334,
			    ['km/m']: 1000.0,
			    ['ft/cm']: 30.48,
			    ['inch/cm']: 2.54,
			    ['mile/cm']: 160934.4,
				['cm/ft']: 0.03280839895013123,
				['cm/inch']: 0.39370078740157477,
				['cm/mile']: 6.21371192237334e-06,
				['cm/m']: 0.01,
				['cm/km']: 1e-05,
			    ['m/cm']: 100,
			    ['km/cm']: 100000,
			   	['lbs/g']: 453.592,
			    ['lbs/ton']: 0.000453592,
			    ['lbs/kg']: 0.453592,
			    ['g/lbs']: 0.0022046244201837776,
			    ['g/ton']: 1e-06,
			    ['g/kg']: 0.001,
			    ['ton/lbs']: 2204.6244201837776,
			    ['ton/g']: 1000000.0,
			    ['ton/kg']: 1000.0,
			    ['kg/lbs']: 2.2046244201837775,
			    ['kg/g']: 1000.0,
			    ['kg/ton']: 0.001,
};

var maxId = 0;

var staticURL;

function ___gen_static() {
	let i = 1;
	let result = [];
	for (; i <= maxId; i++) {
		let IN = document.getElementById('in' + i);
		let OUT = document.getElementById('out' + i);
		result.push(IN.value + '\n' + OUT.innerHTML);
	}
	return btoa(unescape(encodeURIComponent(result.join('\n'))));
}

function ___add_input() {
	let newId = maxId + 1;
	let newLine = document.createElement('div');
	newLine.classList = 'fc fc' + newId;
	document.body.appendChild(newLine);
	let newLineIn = document.createElement('input');
	newLineIn.id = 'in' + newId;
	newLineIn.classList = 'in';
	newLineIn.setAttribute('onkeyup', '___calc(' + newId + ', event)');
	let newLineOut = document.createElement('span');
	newLineOut.id = 'out' + newId;
	newLineOut.classList = 'out';
	newLine.appendChild(newLineIn);
	newLine.appendChild(newLineOut);
	newLineIn.focus();
	maxId++;
	return true;
}

function ___add_static(key, value) {
	let newId = maxId + 1;
	let newLine = document.createElement('div');
	newLine.classList = 'fc fc' + newId;
	document.body.appendChild(newLine);
	let newLineIn = document.createElement('span');
	newLineIn.id = 'in' + newId;
	newLineIn.classList = 'in';
	newLineIn.innerHTML = key;
	let newLineOut = document.createElement('span');
	newLineOut.id = 'out' + newId;
	newLineOut.classList = 'out';
	newLineOut.innerHTML = value;
	newLine.appendChild(newLineIn);
	newLine.appendChild(newLineOut);
	newLineIn.focus();
	maxId++;
	return true;
}

function ___calc(id, event) {
	if (event.keyCode === 13 && id == maxId) {
		return ___add_input();
	} else if (event.keyCode === 13 || event.keyCode == 40 && id != maxId) {
		document.getElementById('in' + (id + 1)).focus();
	}
	if (event.keyCode === 38 && id != 1) {
		document.getElementById('in' + (id - 1)).focus();
	}
	let IN = document.getElementById('in' + id);
	let OUT = document.getElementById('out' + id);
	let expr = IN.value;
	if (id > 1) {
		expr = expr.replace(/ans/g, document.getElementById('out' + (id - 1)).innerHTML.split(String.fromCharCode(8239)).join(''));
	}
	for (let i = 1; i < id; i++) {
		expr = expr.replace((new RegExp('\\@@-' + i, 'g')), document.getElementById('in' + (id - (i))).value);
		expr = expr.replace((new RegExp('\\@@' + i, 'g')), document.getElementById('in' + (i)).value);
		expr = expr.replace((new RegExp('\\@-' + i, 'g')), document.getElementById('out' + (id - (i))).innerHTML.split(String.fromCharCode(8239)).join(''));
		expr = expr.replace((new RegExp('\\@' + i, 'g')), document.getElementById('out' + (i)).innerHTML.split(String.fromCharCode(8239)).join(''));
	}
	if (expr === '') {
		OUT.innerHTML = '&nbsp;';
		return;
	}
	let found = expr.match(__exch);
	while (found) {
		let curr1 = found[2].toLowerCase();
		let curr2 = found[3].toLowerCase();
		let rate = undefined;
		if (`${curr1}/${curr2}` in __rates) {
			rate = __rates[`${curr1}/${curr2}`];
		} else {
			let req = new XMLHttpRequest();
			req.open('GET', `https://api.cryptonator.com/api/ticker/${curr1}-${curr2}`, false);
			req.send();
			if (req.status == 200) {
				rate = JSON.parse(req.responseText).ticker.price;
			}
		}
		__rates[`${curr1}/${curr2}`] = rate;
		if (rate) {
			expr = expr.replace(__exch, '(' + (rate * eval(found[1])) + ')');
		} else {
			expr = expr.replace(__exch, 'WRONGCURR');
		}
		found = expr.match(__exch);
	}
	try {
		let ans = eval(expr);
		if (ans === undefined || expr == '') {
			ans = '&nbsp;'
		}
		if (typeof ans == 'number' || ans == '&nbsp;') {
			if (ans != '&nbsp;') {
				let intgr;
				let tail;
				ans = ''+(+ans.toFixed(6));
				console.log(ans);
				if (ans.search('\\.') != -1) {
					console.log('WTF')
					ans = ans.split('.');
					intgr = ans[0];
					tail = '.' + ans[1];
				} else {
					intgr = ans;
					tail = '';
				}
				if (intgr.length >= 5 && intgr != 'Infinity') {
					let newAns = '';
					intgr.split('').reverse().forEach((c, n) => {
						newAns += c;
						if (n % 3 == 2) {
							newAns += ' ';
						}
					});
					intgr = newAns.split('').reverse().join('').trim().split(' ').join('&#8239;');
				}
				OUT.innerHTML = intgr + tail; // FIXME
			}
		}
		if (OUT.classList.contains('invalid')) {
			OUT.classList.remove('invalid');
		}
	} catch (error) {
		OUT.classList.add('invalid');
	}
	
	staticURL = ___gen_static();
	___calc_all(id + 1);
	document.getElementById('staticlink').value = 'https://fcalc.github.io/#' + staticURL;
}

function ___calc_all(from_) {
	let urlParts = document.URL.split('#');
	if (urlParts.length > 1 && urlParts[1] != '') {
		let anchor = urlParts[1];
		staticURL = anchor;
		document.getElementById('staticversion').href = '#' + staticURL;
		let data = decodeURIComponent(escape(atob(anchor))).split('\n');
		while (data.length) {
			let key = data.shift();
			let value = data.shift();
			___add_static(key, value);
		}
		return false;
	}
	let id = (from_ || 1);
	let finished = false;
	while (!finished) {
		if (document.getElementById('in' + id) !== null) {
			___calc(id, {});
		} else {
			finished = true;
		}
		id++;
	}
	return true;
}

function ___blink_cancopy() {
	let cancopy = document.getElementById('cancopy');
	cancopy.classList.remove('hidden');
	setTimeout(function() {
		cancopy.classList.add('hidden');
	}, 2000);
	document.getElementById('staticlink').select();
	document.execCommand('Copy');
}
