class Castle{
    constructor(hitbox, maxHealth){
        this.hitbox = hitbox;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.effect = 0;
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
    
        //draw castle(so skulls from Team 1 can hide in the castle)
        coDrawImage('castle', -1, 0, 400, 1, this.effect>0, 0, 0.75);
    
        //draw health bar of castle
        drawHealthBar(5,290,40,4,this.health,this.maxHealth,"#FFFFFF","#393939","LEFT");
        
        ctx.lineWidth=1;
    
        //debug only: draw castle's hitbox
        if(debugging==1){
            drawRect(this.hitbox, 1);
        }
    }
}

//the castle you're defending's hitbox
var castle = new Castle(hitbox=[16,302,19,98], maxHealth=2000);