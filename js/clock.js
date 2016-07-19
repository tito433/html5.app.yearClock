window.onload =function(){
    new Clock();
}

function Clock(dom){
    Canvas.call(this,dom);
    this.seconds=[];
    this.minutes=[];
    this.hours=[];
    this.months=[];
    this.days=[];
    

    var date = new Date,
        radius=this.height/2-20,
        _seconds = date.getSeconds(),
        _minutes = date.getMinutes(),
        _hour = date.getHours()%12,
        _day=date.getDate()-1,
        cMonth=date.getMonth(),
        cYear=date.getFullYear(),
        dateyear = new Date(cYear, 0, 1),
        dateMonth = new Date(cYear, cMonth, 1);
    // this.month=new Month(date.getYear(),7).position(this.width/2,this.height/2);

    // var dy=(((12-_hour)*60-(60-_minutes)))*60-(60-_seconds);
    // this.month.addAngle(-(_day-(dy/86400)));
    // this.addDrawable(this.month);
    var sPMin=_minutes*3600+_seconds;
        sPassHour=_hour*3600+sPMin,
        sPassMon=dayOfYear*24*3600+sPassHour;

    for(var i=0;i<12;i++){
        //add months
        var month=new Month(i,cYear).position(this.width/2,this.height/2).radius(radius);
        month.addAngle(-(date - dateyear)/1000);

        this.months.push(month);
        this.addDrawable(month);

        var hour=new Hour(i).position(this.width/2,this.height/2).radius(radius-100);
        var hr=(60-_minutes)*60-(60-_seconds);
        hour.addAngle(-(_hour-(hr/3600)));
        this.hours.push(hour);
        this.addDrawable(hour);
    }
    radius-=50;

    var nDays=this.months[0].nDays(cYear,cMonth),
        secPassedOfDays=(date-dateMonth)/1000;

    for(var i=0;i<nDays;i++){
        var day=new Day(i,nDays).position(this.width/2,this.height/2).radius(radius);
        day.addAngle(-secPassedOfDays);
        this.days.push(day);
        this.addDrawable(day);
    }

    radius-=50;
    for(var i=0;i<60;i++){
        var min=new Minute(i).position(this.width/2,this.height/2).radius(radius-50);
        var mn=60-_seconds;
        
        min.addAngle(-(_minutes-(mn/60)));
        this.minutes.push(min);
        this.addDrawable(min);
        //add seconds
        var second=new Second(i).position(this.width/2,this.height/2).radius(radius-100);
        second.addAngle(-_seconds);
        this.seconds.push(second);
        this.addDrawable(second);

    }
    
    this.doSecond=function(){
        this.seconds.forEach(function(s){
            s.addAngle(-1/20);
        })
        this.minutes.forEach(function(s){
            s.addAngle(-1/(20*60));
        })
        this.hours.forEach(function(s){
            s.addAngle(-1/(20*60*60));
        })
    }
    this.addDrawable(new Exis().position(this.width/2,this.height/2).radius(this.height/2));

    setInterval(this.doSecond.bind(this), 50);
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
        this._sE+=a*this._perDeg;
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


function Month(i,year){
    CurevedRect.call(this,i,12);
    var date=new Date;

    this.n=i;
    this.h=50;
    this.year=year==undefined?date.getFullYear():year;

    var _sMonth = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
    this.label=_sMonth[i];
    this.nDays=function(year,month){
        var _nMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31),
            nDays=_nMonth[month];

        if(month==1 && year%4 == 0 && year%400 != 0){
            nDays=29;
        }
        return nDays;
    }
    this.addAngle=function(seconds){
        var nDays=365;
        if(this.year%4 == 0 && this.year%400 != 0){
            nDays+=1;
        }
        var nSec=nDays*24*3600,
            perSec=(2*Math.PI)/nSec;
        this._sE+=(perSec*seconds);
        return this;
    }
}
Month.prototype = Object.create(CurevedRect.prototype);
Month.prototype.constructor = Month;

function Day(i,n){
    CurevedRect.call(this,i,n);
    this.h=50;
    this.n=n;
    this.addAngle=function(seconds){
        var nSec=this.n*24*3600,
            perSec=(2*Math.PI)/nSec;
        this._sE+=(perSec*seconds);
        return this;
    }
}
Day.prototype = Object.create(CurevedRect.prototype);
Day.prototype.constructor = Day;



function Hour(i){
	CurevedRect.call(this,i);
    this.r=400;
    this.h=50;

}
Hour.prototype = Object.create(CurevedRect.prototype);
Hour.prototype.constructor = Hour;


function Minute(n){
    CurevedRect.call(this,n,60);
    this.r=350;
    this.font="16px Verdana";
    this.h=50;
}
Minute.prototype = Object.create(Drawable.prototype);
Minute.prototype.constructor = Minute;


function Second(n){
    CurevedRect.call(this,n,60);
    this.font="13px Verdana";
    this.r=300;
    this.h=50; 
    
}
Second.prototype = Object.create(CurevedRect.prototype);
Second.prototype.constructor = Second;

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