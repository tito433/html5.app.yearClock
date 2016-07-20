function Clock(dom){
    Canvas.call(this,dom);
    
    var radius=this.height/2-40;


    for(var i=0;i<12;i++){
        var month=new Month(i).position(this.width/2,this.height/2).radius(radius);
        month.addAngle(DateUtil.passedSecond(4));

        this.addDrawable(month);

        var hour=new Hour(i).position(this.width/2,this.height/2).radius(radius-100);
        hour.addAngle(DateUtil.passedSecond(2));
        this.addDrawable(hour);
    }
    radius-=50;

    for(var i=0,ln=DateUtil.dayInMonth();i<ln;i++){
        var day=new Day(i,ln).position(this.width/2,this.height/2).radius(radius);
        day.addAngle(DateUtil.passedSecond(3));
        this.addDrawable(day);
    }

    radius-=50;
    for(var i=0;i<60;i++){
        var min=new Minute(i).position(this.width/2,this.height/2).radius(radius-50);        
        min.addAngle(DateUtil.passedSecond(1));
        this.addDrawable(min);
        //add seconds
        var second=new Second(i).position(this.width/2,this.height/2).radius(radius-100);
        second.addAngle(DateUtil.passedSecond(0));
        this.addDrawable(second);

    }

    this.doTick=function(){
        if(this.drawables.length){
            for(var i=0,ln=this.drawables.length;i<ln;i++){
                if(this.drawables[i].addAngle){
                    this.drawables[i].addAngle(1/20);
                }
            }
        }
    }
    this.addDrawable(new Exis().position(this.width/2,this.height/2).radius(this.height/2));
    this.addDrawable(new TimeNow().position(this.width/2,this.height/2));

    setInterval(this.doTick.bind(this), 50);
}
Clock.prototype = Object.create(Canvas.prototype);
Clock.prototype.constructor = Clock;

function CurevedRect(i,g){
    Drawable.call(this);

    var debug=true;

    this.group=g||12;
    this.label=i+1;
    this._perDeg=(2*Math.PI)/this.group;
    this._sE=1.5*Math.PI+this._perDeg*i;

    this.addAngle=function(a){
        this._sE-=a*this._perDeg;
    };
    this.draw=function(ctx){
        

        var degE=this._sE+this._perDeg;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle=this.color;
        ctx.arc(this.x,this.y,this.r,this._sE,degE);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r-this.h,this._sE,degE);
        ctx.stroke();
        // draw lines 0
        ctx.beginPath();
        var x0=this.x+(this.r-this.h)*Math.cos(this._sE),
            x=this.x+this.r*Math.cos(this._sE),
            y0=this.y+(this.r-this.h)*Math.sin(this._sE)
            y=this.y+this.r*Math.sin(this._sE);
        ctx.moveTo(x0,y0);
        ctx.lineTo(x,y);
        ctx.stroke();

        //write number
        var centerAngle=this._sE+this._perDeg/2;
        x=this.x+(this.r-this.h/2)*Math.cos(centerAngle);
        y=this.y+(this.r-this.h/2)*Math.sin(centerAngle);
        
        ctx.font=this.font;
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';

        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(centerAngle+Math.PI/2);
        ctx.fillText(this.label,0,0);
        ctx.restore();
        
    }

}
CurevedRect.prototype = Object.create(Drawable.prototype);
CurevedRect.prototype.constructor = CurevedRect;


function Month(i){
    CurevedRect.call(this,i,12);
    this.n=i;
    this.h=50;
    this._nSeconds=DateUtil.secondsInYear();
    var _sMonth = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
    this.label=_sMonth[i];
    
    this.addAngle=function(seconds){
        var perSec=(2*Math.PI)/this._nSeconds;
        this._sE-=(perSec*seconds);
        return this;
    }
}
Month.prototype = Object.create(CurevedRect.prototype);
Month.prototype.constructor = Month;

function Day(i,n){
    CurevedRect.call(this,i,n);
    this.h=50;
    this.addAngle=function(seconds){
        var nDays=365;
        if(this.year%4 == 0 && this.year%400 != 0){
            nDays+=1;
        }
        var nSec=this.group*24*3600,
            perSec=(2*Math.PI)/nSec;
        this._sE-=(perSec*seconds);
        return this;
    }
}
Day.prototype = Object.create(CurevedRect.prototype);
Day.prototype.constructor = Day;



function Hour(i){
	CurevedRect.call(this,i,12);
    this.r=400;
    this.h=50;
    this.addAngle=function(seconds){
        var perSec=(2*Math.PI)/(3600*12);
        this._sE-=(perSec*seconds);
        return this;
    }
}
Hour.prototype = Object.create(CurevedRect.prototype);
Hour.prototype.constructor = Hour;


function Minute(n){
    CurevedRect.call(this,n,60);
    this.r=350;
    this.font="16px Verdana";
    this.h=50;
    this.addAngle=function(seconds){
        var perSec=(2*Math.PI)/3600;
        this._sE-=(perSec*seconds);
        return this;
    }
}
Minute.prototype = Object.create(Drawable.prototype);
Minute.prototype.constructor = Minute;


function Second(n){
    CurevedRect.call(this,n,60);
    this.font="13px Verdana";
    this.r=300;
    this.h=50; 
    this.addAngle=function(seconds){
        var perSec=(2*Math.PI)/60;
        this._sE-=(perSec*seconds);
        return this;
    }
    
}
Second.prototype = Object.create(CurevedRect.prototype);
Second.prototype.constructor = Second;


function TimeNow(){
    Drawable.call(this);
    this.draw=function(ctx){
        ctx.beginPath();
        ctx.font="24px Verdana";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        var now=new Date,
            txt=now.getMonth()+'-'+now.getDate()+'-'+(now.getHours()%12)+'-'+now.getMinutes()+'-'+now.getSeconds();
        ctx.fillText(txt,this.x,this.y);
    }

}
TimeNow.prototype = Object.create(Drawable.prototype);
TimeNow.prototype.constructor = TimeNow;

function Exis(){
    Drawable.call(this);
    this.r=450;
    this.draw=function(ctx){
        

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle='#f00';

        var x0=this.x-this.r,
            x=this.x+this.r,
            y0=this.y-this.r,
            y=this.y+this.r;

        ctx.moveTo(this.x,y0);
        ctx.lineTo(this.x,y);
        ctx.stroke();

    }

}
Exis.prototype = Object.create(Drawable.prototype);
Exis.prototype.constructor = Exis;