class LibraryCls{
	constructor(cardLib){
		this.cardLib = cardLib;
	}
}

var Library = new LibraryCls({
	"chopper": new SpawningCard("icon_of_chop", 40, 40, function(){
		new_skull(x=0, y=400, func_=skeleton_walking, 1, 80, 40);
	}),

	"archer": new SpawningCard("icon_of_bow", 120, 30, function(){
		new_skull(x=0, y=400, func_=skeleton_bow_walking_func(20,
			function(lead_l, lead_r){
				let dist=Math.abs(this.x-(this.team==1?lead_r:lead_l)); //get distance
		
				if(dist>270){
					//long shoot
					new_arrow(this.x+16*this.dir, this.y-22, this.team, 11*this.dir, -3, 0.2*this.dir, 0.2, 40);
				}else{
					//short shoot
					new_arrow(this.x+16*this.dir, this.y-22, this.team, 10*this.dir, -1.8, 0.2*this.dir, 0.2, 25);
				}
			}
		), 1, 80, 120);
	}),

	"defender": new SpawningCard("icon_of_shield", 200, 200, function(){
		new_skull(x=0, y=400, func_=skeleton_shield_walking, 1, 1200, 200);
	}),

	"police": new SpawningCard("icon_of_police", 350, 380, function(){
		new_skull(x=0, y=400, func_=skeleton_police_walking_func(200,
			function(lead_l, lead_r){ //a shooting function parameter so you can make costumize shoots
				new_bullet(this.x+25*this.dir, this.y-23, this.team, this.dir*25, 0, this.dir*0.2, 0.05, 250);
				new_bullet(this.x+25*this.dir, this.y-22, this.team, this.dir*25, 0.3, this.dir*0.2, 0.05, 250);
				new_bullet(this.x+25*this.dir, this.y-24, this.team, this.dir*25, -0.3, this.dir*0.2, 0.05, 250);
			}
		), 1, 200, 350);
	}),
});