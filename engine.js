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

//purse
var army=0;

//wave number & ticks passed in wave
var wave=1;

//cards hotbar
var spots_ID = ["chopper", "archer", "defender", "police", "healer"];

//ID to Spot() object
var spots = toSpots(spots_ID);

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

		castle.drawSelf();

		drawSkulls(GameObjects.skulls, team=1);

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
		
		for(let i=0;i<GameObjects.healbomb.length;i++){
			healbomb= new ObjectInstance("healbomb",i)

			i += HealBomb.frameAction(healbomb,GameObjects.skulls)
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

			spot.drawSelf(Library.cardLib, army, spots.length-1);

			spot.updateBuff(Library.cardLib);

			if(new_cursor_click){
				army -= spot.cursorEvent(Library.cardLib, cursor_x, cursor_y, army, spots.length-1);
			}
		}
				
		new_cursor_click = false;

		//wave text
		coDrawImage('wave_text', -1, 268, 7, 1, 0, 0, 2.2);
		printNumber(wave, 306, 8, 0.8, 0);

		drawProgressBar(timing, maxTiming(wave));

		//if the castle's health gone too low, the game ends
		if(castle.health<=0){
			clearScreen();
			DEATH=true;
		}

		if(timing >= lastEnemyTiming(wave)){
			let _is_enemy_flag=false;

			for(let i=0;i<GameObjects.skulls.length;i++){
				if(GameObjects.skulls[i].team==2) _is_enemy_flag=true;
			}

			if(!_is_enemy_flag){
				for(let i=0; i<GameObjects.skulls.length; i++){
					if(GameObjects.skulls[i].team == 1){
						army += GameObjects.skulls[i].value;

						GameObjects.skulls[i].dying = true;
					}
				}

				if(timing < maxTiming(wave)){
					army += generation_speed * (maxTiming(wave) - timing);
				}

				wave+=1;

				timing=0;
			}
		}
	}
}

//set mainloop
setInterval(loop, 30);

// setTimeout(function(){wave=4;timing=0; army=2100;}, 100);

/*

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
	printNumberA(Object.keys(store), -100, 200, 2, 0, 8, "left");
}, 100);

*/