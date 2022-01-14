function skeleton_healer_walking_func(reload=400,
    shoot_func=function(l_l,l_r){
        let dist = Math.abs(this.x-(this.team==1?l_l:l_r));
        new_healbomb(this.x+16*this.dir, this.y-22, this.team, 150*this.dir, (22/Math.max(dist,15)-4*Math.max(dist,15)/900)*150, 0, 8/900*(150)**2, 0.2, randomize(60, 80), 150, 0.25);
    },
	walking_cycle_time = 4,
	walking_cycle_count = 3,
	full_walking_cycle_delay = 8,
	before_attack_delay = 4,
	detect_radius = 450,
	rapid_attack_radius = 700,
	attack_radius = 20
){
    function skeleton_healer_walking(E,W,init){
        if(init=="INIT"){
            this.attack_radius=attack_radius;
            this.skipNeigborEnemies=true;
            return;
        }
        //this.tick property records the animation cycle frame
        this.tick++;

        //direction (1 or -1)
        dir=this.dir

        //healer-skull's costume movement
        if(this.tick<=4*walking_cycle_time*walking_cycle_count){
            if(this.tick%(4*walking_cycle_time)==1){
                if(this.tick==1){
                    this.cst="healer_idle";
                }else{
                    this.cst="healer_idle";
                    this.x+=2*dir;
                }
            }
    		if(this.tick%(4*walking_cycle_time)==1+walking_cycle_time){
				this.cst="healer2_walk";
				this.x+=2*dir;
			}
			if(this.tick%(4*walking_cycle_time)==1+walking_cycle_time*2){
				this.cst="healer3_walk";
				this.x+=4*dir;
			}
			if(this.tick%(4*walking_cycle_time)==(1+walking_cycle_time*3)%(4*walking_cycle_time)){
				this.cst="healer4_walk";
				this.x+=6*dir;
			}
            
        }
        if(this.tick==4*walking_cycle_time*walking_cycle_count+1){
            this.cst="healer_idle"
			this.x+=3*dir;
        }

        if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay && ((this.x+detect_radius<=E&&this.team==1)||(this.x-detect_radius>=W&&this.team==2))){
           this.tick=1; 
        }

        if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay+before_attack_delay){this.cst="healer_idle"}
        if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay+before_attack_delay+7){this.cst="healer2"}
        if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay+before_attack_delay+14){this.cst="healer3"}
        if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay+before_attack_delay+21){this.cst="healer4"}
        if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay+before_attack_delay+28){this.cst="healer_idle";/*custom shot*/this.shoot_func=shoot_func;this.shoot_func(E,W)}
        if(this.tick==4*walking_cycle_time*walking_cycle_count+1+full_walking_cycle_delay+before_attack_delay+28+reload+12){
            if((this.team==1&&this.x+rapid_attack_radius>=E)||(this.team==2&&this.x-rapid_attack_radius<=W)){
                this.tick=4*walking_cycle_count*walking_cycle_time+1;
            }else{
                this.tick=1;
            }
        }
    }
    return skeleton_healer_walking;
}