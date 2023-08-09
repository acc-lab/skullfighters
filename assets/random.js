//returns random number between min and max(both included)

var rseed = 0;

function randomize(min, max) {
	rseed *= 7;
	rseed += 1;
	rseed %= 101;

	return Math.floor((rseed / 101) * (max - min + 1) ) + min;
}
