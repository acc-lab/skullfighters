/*initialize*/

//get canvas
var cv = document.getElementById("game-canvas");

var SCALE = 3;

/*debug*/
var debugging=false;

cv.width = SCALE*900;
cv.height = SCALE*400;

//get drawing context
var ctx = cv.getContext("2d");

ctx.imageSmoothingEnabled = false;


/*body of the game*/

//a.k.a "tick", how many screen refreshes passed
var timing=0;

//the "castle alive" boolean
var DEATH=false;

var army=0;

var wave=1;
var max_timing=maxTiming(wave);

class GameObjectsCls{
	constructor(){
		this.skulls=[] //skulls: your skull team and the enemies' skull team
		this.arrows=[] //bow-skull's arrow
		this.bullets=[] //police-skull's shotgun bullet
		this.chops=[] //axe-skull's chop
	}
}

var GameObjects = new GameObjectsCls();

class ObjectInstance{
	constructor(source, index){
		this.source = source;
		this.index = index;
	}
	removeSelf(){
		GameObjects[this.source].splice(this.index, 1);
		delete this;
	}
	get instance(){
		return GameObjects[this.source][this.index];
	}
}

class SpawningCard{
	constructor(icon_img, price, max_buff, sum_func){
		this.icon_img = icon_img;
		this.price = price;
		this.max_buff = max_buff;
		this.sum_func = sum_func;
	}
	drawSelf(army, buff, spot_x, spot_y=5){
		coDrawImage(this.icon_img, -1, spot_x, spot_y, 1, 0, (army<this.price || buff>0)*70, 3);

		printNumber('$'+this.price, spot_x, 62, 0.7, (army<this.price || buff>0)*70, 10, "center");
	}
	clickEvent(army){
		if(parseInt(army) >= this.price){
			this.sum_func();

			return this.price;
		}

		return 0;
	}
}

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

spots_ID = ["chopper", "archer", "defender", "police"];

spots = []

for(i=0;i<spots_ID.length;i++){
	spot = new Spot(i, spots_ID[i]);
	spots.push(spot);
}

max_spot = spots_ID.length-1;

/*MAINLOOP*/
function loop(){
	//if the images are all loaded, and the game hasn't stop(DEATH) yet
	if(loaded && !DEATH){
		//generates enemy
		timing+=1;

		if ((re=levelFunction(wave, timing)) != -1)
			army += re;

		//clear all screen
		clearScreen();

		for(i=0;i<GameObjects.skulls.length;i++){
			skull = new ObjectInstance("skulls", i);

			i += Skull.frameAction(skull, GameObjects.skulls); // 0 or -1
		}

		drawSkulls(GameObjects.skulls, team=1);

		castle.drawSelf();

		drawSkulls(GameObjects.skulls, team=2);
		
		//process of arrows from bow-skulls
		for(let i=0;i<GameObjects.arrows.length;i++){
			arrow = new ObjectInstance("arrows", i);
			
			i += Arrow.frameAction(arrow, GameObjects.skulls); // 0 or -1
		}

		for(let i=0;i<GameObjects.bullets.length;i++){
			bullet = new ObjectInstance("bullets", i);

			i += Bullet.frameAction(bullet, GameObjects.skulls); // 0 or -1
		}
		
		for(let i=0;i<GameObjects.chops.length;i++){
			chop = new ObjectInstance("chops", i);

			Chop.frameAction(chop, GameObjects.skulls);
		}
		//set all chops to 0. Every chop only survive for 1 frame
		//for continuous attack, the attacker will spawn a chop attack every frame
		GameObjects.chops=[];

		//increase the property of player
		if(timing<=maxTiming(wave))
			army += generation_speed

		//print the property on the screen
		printNumber('$'+parseInt(army), 10, 5, 0.8, 50*(timing>maxTiming(wave)));

		/* icon image, price, *buff, max buff, func of summoning */

		/* match with slot: 688, 748, 808, 868. Detect box +- 25 */

		for(let i=0; i<spots.length; i++){

			let spot = spots[i];

			spot.drawSelf(Library.cardLib, army, max_spot);

			spot.updateBuff(Library.cardLib);

			if(new_cursor_click){
				army -= spot.cursorEvent(Library.cardLib, cursor_x, cursor_y, army, max_spot);
			}
		}
				
		new_cursor_click = false;

		//wave text
		coDrawImage('wave_text', -1, 268, 7, 1, 0, 0, 2.2);
		printNumber(wave, 306, 8, 0.8, 0);


		drawProgressBar(timing, max_timing);

		//if the castle's health gone too low, the game ends
		if(castle.health<=0){
			clearScreen();
			DEATH=true;
		}

		if(timing>=max_timing){
			let _is_enemy_flag=false;

			for(i=0;i<GameObjects.skulls.length;i++){
				if(GameObjects.skulls[i].team==2) _is_enemy_flag=true;
			}

			if(!_is_enemy_flag){
				wave+=1;

				max_timing=maxTiming(wave);
				timing=0;

				if(max_timing==-1) max_timing=999999999;
			}
		}
	}
}

//set mainloop
setInterval(loop, 30);

/*
(Debug use)

setTimeout(function(){
	function printNumberA(number_txt, x, y, size, effect=0, width=10, align="left"){
		if(!isNaN(number_txt))
			number_txt=''+number_txt;
		
		if(align=="left"){
			for(i=0;i<number_txt.length;i++){
				num = number_txt[i];
				if(num=="$"){
					coDrawImage("icon_of_money", -1, x+width*size*1.5*i, y-2, 1, 0, effect, (size*1.2), [x+width*size*1.5*i-5,y-44,10,30]);
				}else{
					coDrawImage(num, 1, x+width*size*1.5*i, y, 1, 0, effect, size, [x+width*size*1.5*i-5,y-44,10,30]);
				}
			}
		}else if(align=="center"){
			x_dir = (number_txt.length-1)*width*size*1.5/2;
	
			for(i=0;i<number_txt.length;i++){
				num = number_txt[i];
				if(num=="$"){
					coDrawImage("icon_of_money", -1, x+width*size*1.5*i-x_dir, y-2, 1, 0, effect, (size*1.2), [x+width*size*1.5*i-x_dir-5,y-44,10,30]);
				}else{
					coDrawImage(num, 1, x+width*size*1.5*i-x_dir, y, 1, 0, effect, size, [x+width*size*1.5*i-x_dir-5,y-44,10,30]);
				}
			}
		}
	}
	printNumberA(Object.keys(store), 400, 200, 2, 0, 8, "center");
}, 100);
*/