//returns random number between min and max(both included)

var rseed = 0;

function randomize(min, max) {
	rseed += 7;
	rseed %= 100;

	return Math.floor((rseed / 100) * (max - min + 1) ) + min;
}
