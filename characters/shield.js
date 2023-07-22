function skeleton_shield_walking_func(
	walking_cycle_time = 3,
	walking_cycle_count = 3,
	full_walking_cycle_delay = 4,
	detect_radius = 85,
	bash_cd = 66
){
	func = function skeleton_shield_walking(L,R,init=""){
		if(init=="INIT"){
			this.attack_radius = 0;
			this.skipNeighborEnemies = false;

			return;
		}
		
		//this.tick property records the animation cycle frame
		this.tick+=1;

		//direction (1 or -1)
		dir=this.dir;

		//shield-skull's costume movement
		if(this.tick<=4*walking_cycle_time*walking_cycle_count){
			if(this.tick%(4*walking_cycle_time)==1){
				if(this.tick==1){
					this.cst="shield1";
				}else{
					this.cst="shield1";
					this.x+=2*dir;
				}
			}
			if(this.tick%(4*walking_cycle_time)==1+walking_cycle_time){
				this.cst="shield2";
				this.x+=2*dir;
			}
			if(this.tick%(4*walking_cycle_time)==1+walking_cycle_time*2){
				this.cst="shield3";
				this.x+=4*dir;
			}
			if(this.tick%(4*walking_cycle_time)==(1+walking_cycle_time*3)%(4*walking_cycle_time)){
				this.cst="shield4";
				this.x+=6*dir;
			}
		}

		if(this.tick==4*walking_cycle_time*walking_cycle_count+1){
			this.cst="shield1";
			this.x+=2*dir;
		}
		//back to initial animation frame
		if(this.tick>=4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay){
			if(this.team==1 && this.x+detect_radius>=R){
				if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay+bash_cd){
					this.cst="shield1";
					this.tick-=bash_cd;
					new_bash(this.x,this.y-30,1)
				}
			}else if(this.team==2 && this.x-detect_radius<=L){
				if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay+bash_cd){
					this.cst="shield1";
					this.tick-=bash_cd;
					new_bash(this.x,this.y-30,2)
				}
			}else{
				this.tick=1;
			}
		}
	}

	return func;
}

skeleton_shield_walking = skeleton_shield_walking_func();