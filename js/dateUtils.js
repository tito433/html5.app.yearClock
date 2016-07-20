var DateUtil=function(){
	return {
		passedSecond:function(unit){
			unit=undefined==unit?0:unit;
			var now=new Date,
				_minutes = now.getMinutes(),
        		_hour = now.getHours(),
				passed=new Date(now.getFullYear(),now.getMonth(),1);
			switch (unit) {
				case 0:
					return now.getSeconds();
					break;
				case 1:
					return (_minutes-1)*60+now.getSeconds();
					break;
				case 2: //hours
					return _hour*3600+_minutes*60+now.getSeconds();
					break;
				case 3: //days
					return (now-passed)/1000;
				case 4: //months
					passed=new Date(now.getFullYear(),0,1);
					return (now-passed)/1000;
				default:
					console.log('Invalid choise. are 0~n');
					break;
			}
			return 0;
		},
		secondsInYear:function(year){

			if(undefined==year){
				var now=new Date;
				year=now.getFullYear();
			}
		    nDays=365;

		    if(year%4 == 0 && year%400 != 0){
		            nDays++;
		    }
		    return nDays*24*3600;
		},
		dayInMonth:function(month,year){
			var now=new Date;

			if(undefined==year){
				year=now.getFullYear();
				month=month||now.getMonth();
			}
			if(undefined==month){
				month=now.getMonth();
			}
			var _nMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31),
		        nDays=_nMonth[month];
		    
		    if(month==1 && year%4 == 0 && year%400 != 0){
		            nDays=29;
		    }
		    return nDays;
		}
	}
}()