function forMatNum(num){
	return num<10?'0'+num:num+'';
}

function initDays(year,month){
	let totalDays=new Date(year,month,0).getDate();
	let dates=[];
	for(let d=1;d<=totalDays;d++){
		dates.push(forMatNum(d));
	};
	return dates;
}


function randomNum(minNum,maxNum){ 
	switch(arguments.length){ 
		case 1: 
			return parseInt(Math.random()*minNum+1,10); 
		break; 
		case 2: 
			return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
		break; 
			default: 
				return 0; 
			break; 
	} 
}


function initPicker(start,end,mode="date",step,value,flag) {
	let aToday=new Date();
	let tYear,tMonth,tDay,tHours,tMinutes,tSeconds,defaultVal=[];
	let initstartDate=new Date(start);
	let endDate=new Date(end);
	if(start>end){
		initstartDate=new Date(end);
		endDate=new Date(start);
	};
	let startYear=initstartDate.getFullYear();
	let startMonth=initstartDate.getMonth()+1;
	let endYear=endDate.getFullYear();
	let years=[],months=[],days=[],hours=[],minutes=[],seconds=[],returnArr=[];
	let curMonth=flag?value[1]*1:(value[1]+1);
	let totalDays=new Date(startYear,curMonth,0).getDate();
	for(let s=startYear;s<=endYear;s++){
		years.push(s+'');
	};
	for(let m=1;m<=12;m++){
		months.push(forMatNum(m));
	};
	for(let d=1;d<=totalDays;d++){
		days.push(forMatNum(d));
	}
	for(let h=0;h<24;h++){
		hours.push(forMatNum(h));
	}
	for(let m=0;m<60;m+=step*1){
		minutes.push(forMatNum(m));
	}
	for(let s=0;s<60;s++){
		seconds.push(forMatNum(s));
	}
	if(flag){
		returnArr=[
			years.indexOf(value[0]),
			months.indexOf(value[1]),
			days.indexOf(value[2]),
			hours.indexOf(value[3]),
			minutes.indexOf(value[4])==-1?0:minutes.indexOf(value[4]),
			seconds.indexOf(value[5])
		]
	};
	switch(mode){
		case "range":
			if(flag){
				defaultVal=[returnArr[0],returnArr[1],returnArr[2],0,returnArr[0],returnArr[1],returnArr[2]];
				return {years,months,days,defaultVal}
			}else{
				return {years,months,days}
			}
			break;
		case "date":
			if(flag){
				defaultVal=[returnArr[0],returnArr[1],returnArr[2]];
				return {years,months,days,defaultVal}
			}else{
				return {years,months,days}
			}
			break;
		case "yearMonth":
			if(flag){
				defaultVal=[returnArr[0],returnArr[1]];
				return {years,months,defaultVal}
			}else{
				return {years,months}
			}
			break;
		case "dateTime":
			if(flag){
				defaultVal=returnArr;
				return {years,months,days,hours,minutes,seconds,defaultVal}
			}else{
				return {years,months,days,hours,minutes,seconds}
			}
			break;
		case "time":
			if(flag){
				defaultVal=[returnArr[3],returnArr[4],returnArr[5]];
				return {hours,minutes,seconds,defaultVal}
			}else{
				return {hours,minutes,seconds}
			}
			break;			
	}
}




function checklogin(url='') {
	
	let _this = this;
	console.log('这是url:',url);
	// console.log('这是checklogin:',this.$store.state.userInfo);
	let state = _this.$store.state;
	
	let userInfo = uni.getStorageSync('userInfo');
	let token = state.token;
	let expri = state.expri;
	
	console.log('token' , token);
	console.log('expri' , expri);
	console.log(url != 'site/login')
	console.log(url != 'site/retieve-pwd')
	console.log(url != 'site/signup')
	
	// console.log('这是state',  state);

	let current_time = Math.round(new Date() / 1000);

	if (url != 'site/login' && url != 'site/retieve-pwd' && url != 'site/signup'){
		if (token == '' || token == undefined || token == 'undefined' || expri == '' || expri == undefined || expri == 'undefined' || expri < current_time ) {
			this.toast('登录过期!!');
			this.$store.commit('logout');
			uni.redirectTo({
				url: '/pages/ucenter/Login/Login'
			});
			return false;
		}else{
			console.log('没过期');
		}
	}else{
		let token = state.token;
		let expri = state.expri;
		console.log("token: ",token);
		console.log("expri: ",expri);
	}
	return true;
}


function httpRequest(url, method, data, successFn){
	
	let _this = this;
	if (!checklogin(url)) {
		return false;
	}
	
	console.log(checklogin(url));
	

	let state = _this.$store.state;
	let token = state.token;
	let url_token = _this.api_host + url + '?&token='+token;
	console.log('这是加了token的url:',url_token);
	
	uni.request({
		url: _this.api_host + url,
		method: method,
		header: {
			'Authorization': 'Bearer '+token
		},
		data: data,
		success: function(res) {
			console.log(res.data);
			// return false;
			if(res.data.code == 401){
				_this.$store.dispatch('logout')
				uni.redirectTo({
					url:'/pages/ucenter/Login/Login?backpage='
				});
				return false;
			}else{
				console.log('开始调用回调');
				successFn(res);
			}
		},
		fail: (err) => {
			_this.toast(err.errMsg);
			// uni.redirectTo({
			// 	url:'/pages/ucenter/Login/Login?backpage='
			// });
			// _this.toast("服务器错误, 请稍后再试", 'none', 2000);
		}
	});
}



export {
	initDays,
	initPicker,
	httpRequest,
	checklogin,
}