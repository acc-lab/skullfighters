class SpawningCard{
	constructor(icon_img, price, max_buff, sum_func){
		this.icon_img = icon_img;
		this.price = price;
		this.max_buff = max_buff;
		this.sum_func = sum_func;
	}
	drawSelf(army, buff, spot_x, spot_y=5){
		var s=149/3;
		coDrawPartialImage(this.icon_img,spot_x,spot_y,false,0,(buff/this.max_buff)*s,0,s-(buff/this.max_buff)*s,true,1,1-.7*(army<this.price),3)

		coDrawImage(this.icon_img, -1, spot_x, spot_y, 1, 0, (army<this.price || buff>0)*70, 3,null);

		printNumber('$'+this.price, spot_x, 62, 0.7, (army<this.price || buff>0)*70, 10, "center");
	}
	clickEvent(army){
		if(parseInt(army) >= this.price){
			this.sum_func();

			return this.price;
		}

		return 0;
	}
}