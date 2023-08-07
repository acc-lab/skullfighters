class LibraryCls{
	constructor(cardLib){
		this.cardLib = cardLib;
	}
}

var Library = new LibraryCls({
	"chopper": new SpawningCard("icon_of_chop", 30, 30, function(){
		new_skull(x=0, y=400, func_=skeleton_walking, 1, 80, 30);
	}),

	"archer": new SpawningCard("icon_of_bow", 120, 60, function(){
		new_skull(x=0, y=400, func_=skeleton_bow_walking_func(35,
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

	"defender": new SpawningCard("icon_of_shield", 200, 180, function(){
		new_skull(x=0, y=400, func_=skeleton_shield_walking, 1, 1800, 200);
	}),

	"police": new SpawningCard("icon_of_police", 300, 350, function(){
		new_skull(x=0, y=400, func_=skeleton_police_walking_func(150,
			function(lead_l, lead_r){ //a shooting function parameter so you can make costumize shoots
				new_bullet(this.x+25*this.dir, this.y-23, this.team, this.dir*25, 0, this.dir*0.2, 0.05, 400);
				new_bullet(this.x+25*this.dir, this.y-22, this.team, this.dir*25, 0.3, this.dir*0.2, 0.05, 400);
				new_bullet(this.x+25*this.dir, this.y-24, this.team, this.dir*25, -0.3, this.dir*0.2, 0.05, 400);
			}
		), 1, 300, 300);
	}),

	"healer": new SpawningCard("icon_of_healer", 400, 150, function(){
		new_skull(x=0,y=400,func_=skeleton_healer_walking_func(80,
			shoot_func=function(l_l,l_r){
		        let dist = Math.abs(this.x-(this.team==1?l_l:l_r));
		        new_healbomb(this.x+16*this.dir, this.y-22, this.team, 150*this.dir, (22/Math.max(dist,15)-4*Math.max(dist,15)/900)*150, 0, 8/900*(150)**2, 1, randomize(60, 80), 150, 0.25);
	    	}
		), 1, 400, 400)
	})

});