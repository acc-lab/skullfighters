/*basics*/

//clear all screen to default color
function clearScreen(){
	ctx.clearRect(0, 0, cv.width, cv.height);
}

//draw image
function coDrawImage(
		img, //image name to print
		team, //team for skull printing. If it's not a skull(e.g. logo printing), set "team" with -1 (recommended)
		x=0, //x coordinate. Without considering the "shift" property of each image, the function prints the image with (x,y) as left-up corner's coordinate
		y=0, //y coordinate. For skull printing, we recommand 400 as default, and the "shift" property should do the rest job
		dir=1, //direction: left=1, right=-1
		eff=0, //effect: bool or 0,1 number. "1"=fade effect ON, "0"=fade effect OFF
		d_eff=0, //dying effect: use for skull dying fade-out effect
		m_scale=2, //shrink the image by this specific scale. BIGGER=>image smaller
		hitbox=null, //if hitbox=null, team must be -1(at least not 1 and 2)
		sketching=1,// height:width,will keep the same area (sketching>0)
	){
	//get picture by name
	pic=store[img];

	mx=x;
	my=y;

	//shift of image(for x,y axis resp.)
	//if m_scale is 1.5, the shift property is same as the "shift" array's term itself(since it's designed for 1.5x)
	sx=shift[img][0]*(1.5/m_scale);
	sy=shift[img][1]*(1.5/m_scale);

	//get width and height when printed on screen
	mw=store[img].width/m_scale;
	mh=store[img].height/m_scale;


	//eff:0 => alpha:1 (no effects)
	//eff:1 => alpha:0.5 (half-transparented)
	ctx.globalAlpha=1-eff/2;
	

	//if death effect using
	if(d_eff!=0){
		//set alpha, bigger effect => more transparented
		//e.g.: d_eff=20 => alpha=0.8, d_eff=70 => alpha=0.3
		ctx.globalAlpha=1-d_eff/100;
	}

	//face r.h.s
	if(dir==1){
		//draw image
		//l.u. corner coordinate=>(mx+sx,my+sy), e.g.: sx=-20, sy=10 => (mx-20,my+10)
		ctx.drawImage(pic,SCALE*(mx+sx),SCALE*(my+sy),SCALE*mw/Math.sqrt(sketching),SCALE*mh*Math.sqrt(sketching));
	}else{
		//save
		ctx.save();

		ctx.translate(SCALE*(mx-sx),SCALE*(my+sy));

		//zoom
		ctx.scale(SCALE*-1/(m_scale*Math.sqrt(sketching)),SCALE*Math.sqrt(sketching)/m_scale);

		//draw
		ctx.drawImage(pic,0,0);

		//back to the original property while doing ctx.save()
		ctx.restore();
	}
	
	//reset the alpha to original non-transparent
	ctx.globalAlpha=1;

	//debug mode only: print the hitbox of this skull(skip automatically if team is -1)
	if(debugging && (hitbox != null)){
		drawRect(hitbox, team);
		if(team == 1 || team == 2) drawRect([x-0.5,y-0.5,1,1], team);
	}
}
//draw part of image
function coDrawPartialImage(
	img,// self explantory
	x=0,//image x coord on screen
	y=0,//image y coord on screen
	scaloriginal=false,//partial image dependent on screen display or original image
	cutx=0,//Partial image left top point at original image(if no shift set 0)
	cuty=0,//Partial image left top point at original image(if no shift set 0)
	cutw=0,//Partial image width(0 if no cut this axis)
	cuth=0,//Partial image height(0 if no cut this axis)
	anchor=false,//Anchor point of the image ()
	dir=1,//flip or not => -1 or 1
	opacity=1,//opacity
	m_scale=2,//*shrink* image size by this value (tbh idk why it is this way)
	sketching=1,//
){
	var pic=store[img];

	var mx=x;
	var my=y;

	//get image shift
	var sx=shift[img][0]*(1.5/m_scale);
	var sy=shift[img][1]*(1.5/m_scale);

	var cx=cutx;
	var cy=cuty;
	var cw=cutw;
	var ch=cuth;

	//if the image cut is from screen we scale parameter down
	if(scaloriginal){
		cx/=m_scale;
		cy/=m_scale;
		cw/=m_scale;
		ch/=m_scale;
	}
	if(cw==0){
		cw=pic.width/m_scale;
	}
	if(ch==0){
		ch=pic.height/m_scale;
	}

	var mrms=m_scale/SCALE;
	ctx.globalAlpha=opacity;

	if(anchor){
		mx+=Math.round(cx*SCALE*Math.sqrt(sketching))/SCALE;
		my+=Math.round(cy*SCALE*Math.sqrt(sketching))/SCALE;
	}

	if(dir==1){
		ctx.drawImage(pic,Math.round(cx*SCALE)*mrms,Math.round(cy*SCALE)*mrms,Math.round(cw*SCALE)*mrms,Math.round(ch*SCALE)*mrms,(SCALE*(mx+sx)),(SCALE*(my+sy)),Math.round(cw*SCALE/Math.sqrt(sketching)),Math.round(ch*SCALE*Math.sqrt(sketching)));
	}else{
		ctx.save();
		
		ctx.translate(SCALE*(mx-sx),SCALE*(my+sy));

		ctx.scale(-1,1);

		ctx.drawImage(pic,Math.round(cx*SCALE)*mrms,Math.round(cy*SCALE)*mrms,Math.round(cw*SCALE)*mrms,Math.round(ch*SCALE)*mrms,0,0,Math.round(cw*SCALE/Math.sqrt(sketching)),Math.round(ch*SCALE*Math.sqrt(sketching)));

		ctx.restore();
	}

	ctx.globalAlpha=1;

}

//draw rectangle for hitbox
function drawRect(args, team){
	ctx.save();

	ctx.lineWidth = 2;

	ctx.beginPath();
	//select color: team 1(your team)=>green; team 2(enemy)=>red
	ctx.strokeStyle=(t=>{
		switch(t){
			case 1:return "green";
			case 2:return "red";
		}
	})(team);
	ctx.rect(SCALE*args[0], SCALE*args[1], SCALE*args[2], SCALE*args[3]);
	ctx.stroke();
	
	ctx.restore();
}

//draw filled rectangle
function drawFilledRect(args,color){
	ctx.save();
	
	ctx.fillStyle=color;

	ctx.fillRect(SCALE*args[0],SCALE*args[1],SCALE*args[2],SCALE*args[3]);

	ctx.restore();
}

//number text engine(based on "coDrawImage")
function printNumber(number_txt, x, y, size, effect=0, width=10, align="left"){
	if(!isNaN(number_txt))
		number_txt=''+number_txt;
	
	if(align=="left"){
		for(i=0;i<number_txt.length;i++){
			num = number_txt[i];
			if(num=="$"){
				coDrawImage("icon_of_money", -1, x+width*size*1.5*i, y-2, 1, 0, effect, 1/(size*1.2));
			}else{
				coDrawImage(num, -1, x+width*size*1.5*i, y, 1, 0, effect, 1/size);
			}
		}
	}else if(align=="center"){
		x_dir = (number_txt.length-1)*width*size*1.5/2;

		for(i=0;i<number_txt.length;i++){
			num = number_txt[i];
			if(num=="$"){
				coDrawImage("icon_of_money", -1, x+width*size*1.5*i-x_dir, y-2, 1, 0, effect, 1/(size*1.2));
			}else{
				coDrawImage(num, -1, x+width*size*1.5*i-x_dir, y, 1, 0, effect, 1/size);
			}
		}
	}
}

function drawHealthBar(x, y, w, h, val, maxVal, color1, color2, align="MID", health_bar_show, max_health_bar_show){
	var xm;//xmid and ymid of the "bars"
	switch (align) {
		case "MID":
			xm=x;
			break;
		case "LEFT":
			xm=x+w/2;
			break;
		case "RIGHT":
			xm=x-w/2;
			break;
	}

    ctx.lineWidth=SCALE*h;
	
	if(health_bar_show > 1/3*max_health_bar_show)
		ctx.globalAlpha = 1;
	else
		ctx.globalAlpha = 3 * health_bar_show / max_health_bar_show;

    ctx.beginPath();
    ctx.strokeStyle=color2;
    ctx.moveTo(SCALE*(xm-w/2), SCALE*y);
    ctx.lineTo(SCALE*(xm+w/2), SCALE*y);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle=color1;
    ctx.moveTo(SCALE*(xm-w/2), SCALE*y);
    ctx.lineTo(SCALE*(xm-w/2+(val/maxVal)*w), SCALE*y);
    ctx.stroke();
	
	ctx.globalAlpha = 1;
}