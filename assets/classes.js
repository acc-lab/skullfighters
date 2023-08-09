function max(a, b){
	return (a>b?a:b);
}

class Chop{
	constructor(x, y, team, damage){
		this.x=x;
		this.y=y;
		this.team=team;
		this.damage=damage;
	}
	get rect(){
		return [this.x-1.5,this.y-1.5,3,3];
	}
	checkIfTouched(skulls){
		for(j=0;j<skulls.length;j++){
			skull=skulls[j];
			if(touched(skull.rect, this.rect)){
				if(skull.team!=this.team && !skull.dying){
					//if collides, different team and the skull isn't dying yet

					//damage
					skull.damage(this.damage, 10);
					
					return true;
				}
			}
		}
		return false;
	}
	static frameAction(chop, skulls){
		//debug only: draw hitbox
		if(debugging){
			drawRect(chop.instance.rect, chop.instance.team);
		}
		
		chop.instance.checkIfTouched(skulls)
		
		if( castle.projectileCheck(chop) == -1 ) return -1;
		if( castle_enemy.projectileCheck(chop) == -1 ) return -1;
	}
}

class Bash{
	static lifespan=10;
	constructor(x,y,team){
		this.x=x;
		this.y=y;
		this.team=team;
		this.existed_time=0;
		this.vx=13;
		this.damage=1;
	}
	get rect(){
		if(this.team==1)
			return [this.x+12,this.y+4,this.vx,4];
		else
			return [this.x-this.vx-12,this.y+4,this.vx,4];
	}
	checkIfTouched(skulls){
		let flag = false;
		
		for(j=0;j<skulls.length;j++){
			skull=skulls[j];
			if(touched(skull.rect, this.rect)){
				if(skull.team!=this.team && !skull.dying){
					//if collides, different team and the skull isn't dying yet

					//damage
					skull.damage(1, 80);
					skull.x-=this.vx*skull.dir;
					skull.stun=80;

					flag = true;
				}
			}
		}
		return false;
	}
	drawSelf(){
		coDrawImage("bash",this.team,this.x,this.y-8,this.team==1?1:-1,0,0,1,this.rect)
	}
	static frameAction(bash,skulls){
		if(bash.instance.existed_time>=Bash.lifespan){
			bash.removeSelf()
			return -1;
		}
		var ibash=bash.instance;

		//if touched, skull goes backward
		ibash.checkIfTouched(skulls)

		if( castle.projectileCheck(bash) == -1 ) return -1;
		if( castle_enemy.projectileCheck(bash) == -1 ) return -1;

		ibash.x+=ibash.vx*((ibash.team==1)?1:-1);
		ibash.vx*=.8;
		ibash.vx = Math.floor(ibash.vx);
		ibash.existed_time++;

		ibash.drawSelf();
		
		if(debugging){
			drawRect(ibash.rect,ibash.team);
		}

		return 0;
	}

}

class HealBomb{
	constructor(x, y, team, vx, vy, ax, ay, damage, healRange, health, expiringSpeed){
		this.x=x;
		this.y=y;
		this.team=team;
		this.vx=vx;
		this.vy=vy;
		this.ax=ax;
		this.ay=ay;
		this.damage=damage;
		this.tickafterexplode=0;
		this.radius=5;
		this.healRange=healRange;
		this.maxHealth=health;
		this.health=health;
		this.expiringSpeed=expiringSpeed;
		this.exposed=false;
	}
	checkIfTouched(){
		return this.y>=400;
	}
	drawSelf(debug){
		ctx.lineWidth=SCALE

		if(this.tickafterexplode==0){
			coDrawImage("heal-bomb", -1, this.x, this.y, 1, 0, 0, 4);

		}else{
			ctx.beginPath();
			//console.log(this.tickafterexplode)
			ctx.fillStyle="#00FF00"+(Math.floor(32/100*(100-this.tickafterexplode))<16?"0":"")+(Math.floor(32/100*(100-this.tickafterexplode))).toString(16)
			ctx.arc(SCALE*this.x,SCALE*this.y, SCALE*this.radius, 0, 2 * Math.PI);
			ctx.fill()
			ctx.fillStyle="#00000000"
		}

	}
	update(){
		if(this.tickafterexplode>0){
			return
		}
		this.x+=this.vx*3/100;
		this.y+=this.vy*3/100;
		this.vx+=this.ax*3/100;
		this.vy+=this.ay*3/100;
	}
	static frameAction(healbombgameobject,skulls){
		let healbomb=healbombgameobject.instance;

		healbomb.update();
		healbomb.drawSelf();

		if(!healbomb.exploded){
			healbomb.exploded=healbomb.checkIfTouched();
			if(healbomb.exploded){
				playAudio("med_explosion");
			}
		}

		if(healbomb.exploded){
			if(healbomb.tickafterexplode%Math.ceil(40000/healbomb.radius/healbomb.radius)==0)
			new_particle("healParticle",randomize(-healbomb.radius,healbomb.radius)+healbomb.x,randomize(-healbomb.radius,0)+400,100,faMotionWithDeceleration(0,-3,0,.2),dsRotScalFadeDraw(0,1,.5,0,.05,.95,1));
			
			healbomb.tickafterexplode++ ;

			if(healbomb.tickafterexplode>500){
				healbomb.radius=healbomb.healRange;
			}else{
				healbomb.radius=healbomb.healRange*(Math.exp(healbomb.tickafterexplode/5-5)/(Math.exp(healbomb.tickafterexplode/5-5)+1));
			}

			healbomb.health -= healbomb.expiringSpeed;

			if(healbomb.health<=0){
				healbombgameobject.removeSelf();
				return -1;
			}

			for(let index in skulls){
				let skull=skulls[index];
				if(healbomb.team!=skull.team){
					continue;
				}
				if(Math.abs(healbomb.x-skull.x)<=healbomb.radius){
					if(skull.health>=skull.max_health){
						continue;
					}
					skull.health-=healbomb.damage;
					skull.health_bar_show=30;
					healbomb.health+=healbomb.damage;

					if(skull.health>skull.max_health){
						healbomb.health-=skull.max_health-skull.health;
						skull.health=skull.max_health;
					}
					if(healbomb.health<=0){
						skull.health+=healbomb.health;
						healbombgameobject.removeSelf();
						return -1;
					}
				}
			}
		}
		return 0;
	}
}

class Bullet{
	constructor(x, y, team, vx, vy, ax, ay, damage, piercing=1){
		this.x=x;
		this.y=y;
		this.team=team;
		this.vx=vx;
		this.vy=vy;
		this.ax=ax;
		this.ay=ay;
		this.damage=damage;
		this.piercing=piercing;

		this.pierced = [];
	}
	update(){
		this.x+=this.vx;
		this.y+=this.vy;
		this.vx+=this.ax;
		this.vy+=this.ay;
	}
	drawSelf(debug){
		ctx.save();
		
		ctx.strokeStyle="#ffffff";
		ctx.lineWidth=SCALE;
	
		ctx.beginPath();
		ctx.moveTo(SCALE*(this.x-(this.vx-this.ax)), SCALE*(this.y-(this.vy-this.ay)));
		ctx.lineTo(SCALE*this.x, SCALE*this.y);
		ctx.stroke();
	
		ctx.restore();

		//debugging only: draw arrow's hitbox
		if(debug){
			drawRect(this.rect, this.team);
		}
	}
	checkIfTouched(skulls){
		for(let j=0;j<skulls.length;j++){
			skull=skulls[j];
			//for each skull

			if(touched(skull.rect,this.rect)){
				//if skull and arrow touched(i.e., their hitbox collides)
				if(skull.team!=this.team && !skull.dying){
					//if they're from different team and the skull isn't already dying

					if(!this.pierced.includes(skull.uid)){
						//set damage and damage effect
						skull.damage(this.damage, 10);
						this.pierced.push(skull.uid);
						
						return this.pierced.length == this.piercing+1;
					}
				}
			}
		}

		return false;
	}
	static frameAction(bullet, skulls){
		if(Math.abs(bullet.instance.x-450)>=500 || Math.abs(bullet.instance.y-200)>=215){
			bullet.removeSelf();
			
			return -1;
		}

		if(bullet.instance.checkIfTouched(skulls)){
			bullet.removeSelf();

			return -1;
		}

		if( castle.projectileCheck(bullet) == -1 ) return -1;
		if( castle_enemy.projectileCheck(bullet) == -1 ) return -1;

		//basic physic
		bullet.instance.update();

		bullet.instance.drawSelf(debugging);

		return 0;
	}
	get rect(){
		let del_x=this.vx-this.ax;
		let del_y=this.vy-this.ay;
		
		if(del_x>=0 && del_y>=0)
			return [this.x-del_x, this.y-del_y, del_x, del_y];
		if(del_x>=0 && del_y<=0)
			return [this.x-del_x, this.y, del_x, -del_y];
		if(del_x<=0 && del_y>=0)
			return [this.x, this.y-del_y, -del_x, del_y];
		if(del_x<=0 && del_y<=0)
			return [this.x, this.y, -del_x, -del_y];
	}
}

class Arrow{
	constructor(x, y, team, vx, vy, ax, ay, damage){
		this.x=x;
		this.y=y;
		this.team=team;
		this.vx=vx;
		this.vy=vy;
		this.ax=ax;
		this.ay=ay;
		this.damage=damage;
	}
	update(){
		this.x+=this.vx;
		this.y+=this.vy;
		this.vx+=this.ax;
		this.vy+=this.ay;
	}
	drawSelf(debug){
		//get direction to aim
		let direction=Math.atan2(this.vy,this.vx)+2*Math.PI;

		ctx.save();
	
		ctx.translate(SCALE*this.x,SCALE*this.y);
		
		//draw image with the direction by ctx.drawImage()
		//noted that we didn't use coDrawImage() function
		ctx.rotate(direction);
		ctx.drawImage(store["arrow"],SCALE*-store["arrow"].width/4,SCALE*-store["arrow"].height/4, SCALE*store["arrow"].width/2, SCALE*store["arrow"].height/2);

		ctx.restore();

		//debugging only: draw arrow's hitbox
		if(debug){
			drawRect(this.rect, this.team);
			drawRect([this.x-0.5, this.y-0.5, 1, 1], this.team);
		}
	}
	checkIfTouched(skulls){
		for(j=0;j<skulls.length;j++){
			skull=skulls[j];
			//for each skull

			if(touched(skull.rect,this.rect)){
				//if skull and arrow touched(i.e., their hitbox collides)
				if(skull.team!=this.team && !skull.dying){
					//if they're from different team and the skull isn't already dying

					//set damage and damage effect
					skull.damage(this.damage, 10);

					return true;
				}
			}
		}
		return false;
	}
	static frameAction(arrow, skulls){
		//if the arrows overflowed
		if(Math.abs(arrow.instance.x-450)>=465 || Math.abs(arrow.instance.y-200)>=215){
			arrow.removeSelf();
			
			return -1;
		}

		if(arrow.instance.checkIfTouched(skulls)){
			arrow.removeSelf();

			return -1;
		}

		if( castle.projectileCheck(arrow) == -1 ) return -1;
		if( castle_enemy.projectileCheck(arrow) == -1 ) return -1;

		//basic physic
		arrow.instance.update();

		arrow.instance.drawSelf(debugging);

		return 0;
	}
	get rect(){
		if(this.team==1){
			//toward r.h.s
			return [this.x+4,this.y-3,4,5];
		}else{
			//toward l.h.s
			return [this.x-8,this.y-3,4,5];
		}
	}
}

class Skull{
	constructor(x, y, func, team, health, value, spawn_animation, uid){
		this.x=x;
		this.y=y;
		this.cstFunc=func;
		this.team=team;
		this.health=health;
		this.max_health=health;
		this.value=value;
		this.cst="idle";
		this.tick=0;
		this.effect=0;
		this.dying=false;
		this.dying_effect=0;
		this.dir=((t)=>{switch(t){case 1:return 1;case 2:return -1;}})(team);
		this.spawn_animation=spawn_animation;
		this.spawn_animation_done=false;

		this.uid = uid;
		
		this.attack_radius=0;
		this.skipNeighborEnemies=false;

		this.cstFunc(null,null,"INIT"); //init
		
		this.health_bar_show=0;

		this.stun=false;
	}
	damage(dmg, effect_duration){
		this.health -= dmg;
		this.effect = max(this.effect, effect_duration);
		this.health_bar_show = 30;
	}
	drawSelf(){
		if(!this.spawn_animation_done){
			this.spawn_animation_done=this.spawn_animation();
			return;
		}
		coDrawImage(this.cst, this.team, this.x, this.y, this.dir, (this.effect>0), this.dying_effect, 2, this.rect);
		
		if(!this.dying && (this.health_bar_show>0)){
			this.health_bar_show-=1;
			drawHealthBar(this.x,this.y-60,27,4,this.health,this.max_health,"#FFFFFF","#393939", "MID", this.health_bar_show, 30);
		}
	}
	static frameAction(skull, skulls){
		if(!skull.instance.spawn_animation_done){
			return 0;
		}

		// skull: objectInstance() of skull object w.r.t skulls source
		// skull is NOT a instance object of skulls

		if(!skull.instance.dying && skull.instance.health<=0){
			skull.instance.dying=true;
		}

		//if it's not dying yet
		if(!skull.instance.dying){
			//if skull.effect(the damage fade-out effect) is non-zero, minus one
			//if it's 0, keep it 0. Zero=>no effect; Nonzero=>fade-out effect
			skull.instance.effect-=(skull.instance.effect>0);

			let leadings = getLeadings(skull.instance, skulls);

			//run if the skull is not stunned
			if(!skull.instance.stun){
				let force_move = false;

				if(skull.instance.x > castle_enemy.hitbox[0] && skull.instance.team != 1) force_move = true;

				skull.instance.cstFunc(leadings[0], leadings[1], "", force_move);
			}else{
				skull.instance.stun--;
			}

		}else{
			//set normal effect to 0, and make the dying fade-out effect increase
			skull.instance.effect=0;
			skull.instance.dying_effect+=9;

		}

		//if the skull is dying and the dying effect of the skull already makes the skull completely disappeared
		if(skull.instance.dying && skull.instance.dying_effect>=100){
			//delete the skull
			skull.removeSelf();
			
			return -1;
		}
		
		/*
		//if the skull's from Team 1, and it surpassed the r.h.s screen edge
		if(skull.instance.x>=915 && skull.instance.team==1 && !skull.instance.dying){
			//increase the property by the skull's value
			army+=skull.instance.value;

			skull.instance.dying=true;
		}
		*/

		return 0;
	}
	get rect(){
		return [this.x-5,this.y-44,10,30];
	}
}

/*
class Building{
	constructor(x,y,func,team,health,defense,cst){
		this.x=x;
		this.y=y;
		this.health=health;
		this.max_health=health;
		this.cstFunc=func;
		this.defense=defense;
		this.cst="b-idle";
		this.tick=0;
		this.dir=team==1?1:-1;

		this.cstFunc(null,null,"INIT");
	}
	drawSelf(){
		coDrawImage(this.cst, this.team, this.x, this.y, this.dir, (this.effect>0), this.dying_effect, 2, this.rect);

	}
	frameAction(){
		this.drawSelf()
	}
}
*/

function new_chop(x_, y_, team_, damage_=10){
	nchop=new Chop(x_, y_, team_, damage_);
	GameObjects.chops.push(nchop);
}

function new_bash(x_=0,y_=0,team_=1){
	nbash = new Bash(x_,y_,team_);
	GameObjects.bashes.push(nbash);
}

function new_arrow(x_, y_, team_, vx_=11, vy_=-0.5, ax_=0.2, ay_=0.1, damage_=25){
	//vx_,vy_: initial arrow's velocity
	//ax_,ay_: arrow's acceleration (apparently you can have different acceleration for different bows)

	narrow=new Arrow(x_, y_, team_, vx_, vy_, ax_, ay_, damage_);
	GameObjects.arrows.push(narrow);
}

function new_healbomb(x_, y_, team_, vx_, vy_, ax_, ay_, heal_, healRange_, health_, expiringSpeed_){
	nhealbomb=new HealBomb(x_ ,y_, team_, vx_, vy_, ax_, ay_, -heal_, healRange_, health_, expiringSpeed_);
	GameObjects.healbomb.push(nhealbomb);
}

function new_bullet(x_, y_, team_, vx_=11, vy_=-0.5, ax_=0.2, ay_=0.1, damage_=25){
	//vx_,vy_: initial bullet's velocity
	//ax_,ay_: bullet's acceleration (apparently you can have different acceleration for different bullets)

	nbullet=new Bullet(x_, y_, team_, vx_, vy_, ax_, ay_, damage_);
	GameObjects.bullets.push(nbullet);
}

var SKULL_UID = 0;

function new_skull(x_=0, y_=400, func_=skeleton_walking, team_=1, health_=100, value_=0, spawn_animation_=defaultSpawnAnimation()){
	//func_: what the skull do every single screen refresh, that decides the skull's AI, movements, animations and attacks
	//value_: only for Team 1. The property you can get as return if the skull's out of the screen and they survived

	SKULL_UID += 1;

	nskull=new Skull(x_ + randomize(-10, 10), y_, func_, team_, health_, value_,spawn_animation_, SKULL_UID);
	GameObjects.skulls.push(nskull);
}
