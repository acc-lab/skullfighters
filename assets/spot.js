class Spot{
	constructor(spot_number, card_name){
		this.spot_number = spot_number;
		this.card_name = card_name;

		this.buff = 0;
	}
	drawSelf(cardLib, army, max_spot){
		// card align right by default, hence max_spot is necessary here
		// x = 868 - spot * 60, spot starts from 0, -1, -2...

		let card = cardLib[this.card_name];

		let spot_x = 868 - (max_spot - this.spot_number) * 60;

		card.drawSelf(army, this.buff, spot_x);
	}
	updateBuff(){
		this.buff -= (this.buff>0);
	}
	cursorEvent(cardLib, cx, cy, army, max_spot){
		// cx, cy: cursor coordinates

		let card = cardLib[this.card_name];

		let spot_x = 868 - (max_spot - this.spot_number) * 60;
		let hitbox = [spot_x-25, 5, 50, 50];

		if (touched(hitbox, [cx, cy, 0, 0]) && this.buff==0){
			let cost = card.clickEvent(army);

			if(cost > 0){
				this.buff = card.max_buff;

				return cost;
			}
		}

		return 0;
	}
}

function toSpots(spots_ID){
    let spots = [];

    for(i=0;i<spots_ID.length;i++){
        spot = new Spot(i, spots_ID[i]);
        spots.push(spot);
    }
    return spots;
}