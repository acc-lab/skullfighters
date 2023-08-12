//returns random number between min and max(both included)

var rseed = 0;

function randomize(min, max) {
	rseed *= 37019293;
	rseed += 1;
	rseed %= 39047149;

	return Math.floor((rseed / 39047149) * (max - min + 1) ) + min;
}
