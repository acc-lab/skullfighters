function defaultSpawnAnimation(
    up=100,
    stretch=2,
    time=10,
){
    function realspawnfunction(){
        if(!this.atick)
        this.atick=0
		coDrawImage(this.cst, this.team, this.x, this.y-up*(1-this.atick/time), this.dir, 0, (1-this.atick/time)*100, 2, this.rect,(stretch-1)*(1-this.atick/time)+1);
        this.atick++;
        if(this.atick>time){
            return true;
        }
        return false;
    }
    return realspawnfunction;
}