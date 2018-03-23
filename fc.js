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

var __exch = /\(([^\s)]+)\s+([a-zA-Z]{3})\s+in\s+([a-zA-Z]{3})\)/;
var __rates = {};

function ___calc() {
	let IN = document.getElementById('in');
	let OUT = document.getElementById('out');
	let EQ = document.getElementById('eq');
	let expr = IN.value;
	if (expr === '') {
		OUT.innerHTML = '&nbsp;';
		EQ.innerHTML = '&ne;';
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
		EQ.innerHTML = '=';
		if (IN.classList.contains('invalid')) {
			IN.classList.remove('invalid');
		}
	} catch (error) {
		IN.classList.add('invalid');
	}
}
