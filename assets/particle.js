class Particle{
    constructor(img,x,y,expiretime=0,action=faLinearMotion(0,0),drawself=dsStaticDraw(1,1,1,0)){
        this.img=img;
        this.x=x;
        this.y=y;
        this.frameAction=action;
        this.drawSelf=drawself;
        this.tick=0;
        this.expiretime=expiretime;
        this.expire=false;
    }

    static update(particleobj){
        var particle=particleobj.instance

        particle.frameAction();
        particle.drawSelf();
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

//particle FrameAction Template(with fa prefix
function faLinearMotion(
    vx=0,
    vy=0
){
    function frameAction(){
        this.x+=vx;
        this.y+=vy;
    }
    return frameAction;
}

function faMotionWithDeceleration(
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

//particle drawSelf Template(with ds prefix
function dsStaticDraw(
    opacity=1,
    scale=.5,
    sketching=1,
    rotation=0,
    
){
    function drawSelf(){
        drawParticle(this.img,this.x,this.y,scale,rotation,opacity,sketching);
    }
    return drawSelf;
}

function dsRotatingDraw(
    initrot=0,
    rotspd=1,
    opacity=1,
    scale=.5,
    sketching=1
){
    function drawSelf(){
        if(this.tick==0){
            this.currot=initrot;
        }
        drawParticle(this.img,this.x,this.y,scale,this.currot,opacity,sketching);
        this.currot+=rotspd;
    }
    return drawSelf;
}

function dsRotScalFadeDraw(
    irot=0,
    iopac=0,
    iscal=1,
    rotspd=1,//additive
    fadespd=.05,//additive
    scalspd=1,//multiplicative
    sketching=1,
){
    function drawSelf(){
        if(this.tick==0){
            this.crot=irot;
            this.copac=iopac;
            this.cscal=iscal;
        }
        drawParticle(this.img,this.x,this.y,this.cscal,this.crot,this.copac,sketching);
        this.crot+=rotspd;
        this.copac-=fadespd;
        this.cscal*=scalspd;
        if(this.opacity<0){
            this.expire=true;
        }
    }
    return drawSelf;
}


//new particle
function new_particle(_img,_x,_y,_expiretime=0,_action=faLinearMotion(0,0),_drawSelf=dsStaticDraw(1,1,1,0)){
    var nparticle=new Particle(_img,_x,_y,_expiretime,_action,_drawSelf);

    GameObjects.particles.push(nparticle);
}