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

var __exch = /\(([^\s]+)\s+([a-zA-Z]{3})\s+in\s+([a-zA-Z]{3})\)/;
var __rates = {};

var maxId = 0;

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
		expr = expr.replace(/ans/g, document.getElementById('out' + (id - 1)).innerHTML);
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
				OUT.innerHTML = +ans.toFixed(6);
			}
		}
		if (OUT.classList.contains('invalid')) {
			OUT.classList.remove('invalid');
		}
	} catch (error) {
		OUT.classList.add('invalid');
	}
}

function ___calc_all() {
	let id = 1;
	let finished = false;
	while (!finished) {
		if (document.getElementById('in' + id) !== null) {
			___calc(id, {});
		} else {
			finished = true;
		}
		id++;
	}
}