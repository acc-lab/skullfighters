class Particle{
    constructor(img,x,y,expiretime=0,motion=PMot.l(0,0),rotation=PRot.cst(0),scaling=PScal.cst(1),opacity=POpac.cst(1),sketching=PSket.cst(1)){
        this.img=img;
        this.x=x;
        this.y=y;
        this.opac=0;
        this.scale=1;
        this.sket=1;
        this.rot=0;
        this.motf=motion;
        this.rotf=rotation;
        this.scalf=scaling;
        this.opacf=opacity;
        this.sketf=sketching;
        this.opacity
        this.tick=0;
        this.expiretime=expiretime;
        this.expire=false;
    }

    static frameAction(particleobj){
        var particle=particleobj.instance

        particle.motf();
        particle.rotf();
        particle.scalf();
        particle.opacf();
        particle.sketf();
        drawParticle(particle.img,particle.x,particle.y,particle.scale,particle.rot,particle.opac,particle.sket);
        particle.tick++;
        if(particle.expiretime!=0){
            if(particle.tick>=particle.expiretime){
                particle.expire=true;
            }
        }
        if(particle.expire){
            particleobj.removeSelf();
            return -1;
        }
        return 0;
    }
}

//for particle motion
class PMot{
    static l(
        vx=0,
        vy=0
    ){
        function frameAction(){
            this.x+=vx;
            this.y+=vy;
        }
        return frameAction;
    }
    static am(
        vx=0,
        vy=0,
        ax=0,
        ay=0
    ){
        function frameAction(){
            if(this.tick==0){
                this.vx=vx;
                this.vy=vy;
            }
            this.x+=this.vx;
            this.y+=this.vy;
            this.vx+=ax;
            this.vy+=ay;
        }
        return frameAction;
    }
}

//for particle rotation
class PRot{
    static cst(
        angle
    ){
        function Rotation(){
            this.rot=angle;
        }
        return Rotation;
    }
    static l(
        start_angle,
        rotation_speed,
    ){
        function Rotation(){
            if(this.tick==0){
                this.rot=start_angle;
            }else{
                this.rot+=rotation_speed;
            }
            
        }
        return Rotation;
    }
}

//for particle opacity
class POpac{
    static cst(
        opacity
    ){
        function Opacity(){
            this.opac=opacity;
        }
        return Opacity;
    }
    static l(
        start_opac,
        fade_speed
    ){
        function Opacity(){
            if(this.tick==0){
                this.opac=start_opac;
            }else{
                this.opac-=fade_speed;
            }
            if(this.opac<=0){
                this.opac=0;
                this.expire=true;
            }
        }
        return Opacity;
    }
}

//for particle sketching
class PSket{
    static cst(
        sketch
    ){
        function Sketching(){
            return sketch;
        }
        return Sketching;
    }
    static e(
        start_sket,
        sket_factor
    ){
        function Sketching(){
            if(this.tick==0){
                this.sket=start_sket;
            }else{
                this.opac*=sket_factor;
            }
        }
        return Sketching;
    }
}

//for particle scaling
class PScal{
    static cst(
        scale
    ){
        function Scaling(){
            this.scale=scale;
        }
        return Scaling;
    }
    static e(
        start_scal,
        scal_factor
    ){
        function Scaling(){
            if(this.tick==0){
                this.scale=start_scal;
            }else{
                this.scale*=scal_factor;
            }
        }
        return Scaling;
    }
}

//new particle
function new_particle(_img,_x,_y,_expiretime=0,_motion_function=PMot.l(0,0),_rotation_function=PRot.cst(0),_scaling_function=PScal.cst(1),_fading_function=POpac.cst(1),_sketcing_function=PSket.cst(1)){
    var nparticle=new Particle(_img,_x,_y,_expiretime,_motion_function,_rotation_function,_scaling_function,_fading_function,_sketcing_function);

    GameObjects.particles.push(nparticle);
}