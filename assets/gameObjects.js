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