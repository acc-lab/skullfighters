class Castle{
    constructor(x, hitbox, maxHealth, team){
        this.x = x;
        this.y = 400;

        this.hitbox = hitbox;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.effect = 0;
        this.team = team;
    }
    //function for castle to take damage
    damage(dmg){
        this.health -= dmg;

        //fade-out effect
        this.effect = 5;
    }
    drawSelf(){
        //castle's effect processing
        this.effect-=(this.effect>0);
    
        //draw castle
        coDrawImage('castle', this.team, this.x, this.y, ((t)=>{switch(t){case 1:return 1;case 2:return -1;}})(this.team), this.effect>0, 0, 0.75, this.hitbox);
    
        //draw health bar of castle
        drawHealthBar(this.x+(this.team==1?5:-46),this.y-110,40,4,this.health,this.maxHealth,"#FFFFFF","#393939","LEFT");
        
        ctx.lineWidth=1;
    }
    projectileCheck(projectile){
		if(touched(this.hitbox, projectile.instance.rect)){
			//if the projectile touched the castle
			if(projectile.instance.team!=this.team){
				//if the arrow is from the enemies' team

				//damage the castle
				this.damage(projectile.instance.damage);

				projectile.removeSelf();
				
				return -1;
			}
		}
    }
}

//the castle you're defending's hitbox
var castle = new Castle(x=0, hitbox=[16,302,19,98], maxHealth=2000, team=1);
var castle_enemy = new Castle(x=900, hitbox=[865,302,19,98], maxHealth=2000, team=2);