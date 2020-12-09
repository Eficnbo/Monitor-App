import {executeQuery} from '../database/database.js'
import {bcrypt} from "../deps.js"
const postMorningData = async(sleepdur,sleepqua,mood,user_id,time) => {
	const today = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time = CURRENT_DATE;",user_id)
	if(!today || today.rowsOfObjects().length === 0) {
		await executeQuery("INSERT INTO data(sleepduration,sleepquality,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",sleepdur,sleepqua,mood,user_id,time)
	}
	else {
		await executeQuery("DELETE FROM data WHERE user_id = $1 AND time = CURRENT_DATE;",user_id)
		await executeQuery("INSERT INTO data(sleepduration,sleepquality,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",sleepdur,sleepqua,mood,user_id,time)
	}
}

const postEveningData = async(studytime,sportstime,mood,user_id,time) => {
	
	const today = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time = CURRENT_DATE;",user_id)
	if(!today || today.rowsOfObjects().length === 0) {
		await executeQuery("INSERT INTO data(studytime,sportstime,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",studytime,sportstime,mood,user_id,time)
	}
	else {
		await executeQuery("DELETE FROM data WHERE user_id = $1 AND time = CURRENT_DATE;",user_id)
		await executeQuery("INSERT INTO data(studytime,sportstime,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",studytime,sportstime,mood,user_id,time)
	}
	
	
}

const calcAverage = (dat) => {
	if(!dat || dat.length == 0 ){
		return 0
	}
	return dat.reduce((a, b) => a + b, 0)/dat.length
}

function getDateOfISOWeek(w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date1 - date2);

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);

}

const getSummaryWeekly = async(id,params) => {
	let date,result;
	if(params.get('week')) {
		date = (params.get('week'))
		date = date.split('-')
		const year = Number(date[0])
		const week = Number(date[1].substring(1))
		date = getDateOfISOWeek(week,year)
		console.log(date)
		var today = new Date();
		const number1 = days_between(today,date)
		
		result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN CURRENT_DATE-(EXTRACT(DOW FROM NOW())::INTEGER-7-$2) AND NOW()::DATE-(EXTRACT(DOW from NOW())::INTEGER+3-$2);",id,number1);
	}
	else {
	//query for last 7 days of data:
	//const result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+2;",2);
		result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN CURRENT_DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+3;",id);
	}
	const res = result.rowsOfObjects()
	let avg_sleepdur = []
	let avg_sleepquality = []
	let avg_sportstime = []
	let avg_mood = []
	let avg_studytime = []
	var i;

	for(i in res) {
		if(res[i].sleepduration) {
			avg_sleepdur.push(Number(res[i].sleepduration))
		}
		if(res[i].sleepquality) {
			avg_sleepquality.push(Number(res[i].sleepquality))
		}
		if(res[i].sportstime) {
			avg_sportstime.push(Number(res[i].sportstime))
		}
		if(res[i].studytime) {
			avg_studytime.push(Number(res[i].studytime))
		}
		if(res[i].mood) {
			avg_mood.push(Number(res[i].mood))
		}
	}
	avg_sleepquality = calcAverage(avg_sleepquality)
	avg_sleepdur = calcAverage(avg_sleepdur)
	avg_sportstime = calcAverage(avg_sportstime)
	avg_studytime = calcAverage(avg_studytime)
	avg_mood = calcAverage(avg_mood)
	return [res,avg_sleepdur,avg_sleepquality,avg_sportstime,avg_studytime,avg_mood]
}

const getSummaryMonthly = async(id,params) => {
	let date,result;
	if(params.get('month')) {
		date = (params.get('month'))
		date = date.split('-')
		const year = Number(date[0])
		const month = Number(date[1])
		date = new Date(year,month-1,1)
		console.log(date)
		var today = new Date();
		console.log(today)
		const number1 = days_between(today,date)
		console.log(number1)
		const number3 =number1
		const number2 = (31-number1)
		result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN (CURRENT_DATE-make_interval(days := $2)) AND (CURRENT_DATE+make_interval(days := $3));",id,number3,number2);
		//result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN CURRENT_DATE-EXTRACT(DOW FROM NOW())::INTEGER-$2 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+$3;",id,number1,number2);
	}
	else {
	//query for last 7 days of data:
	//const result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+2;",2);
		result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN CURRENT_DATE-EXTRACT(DOW FROM NOW())::INTEGER-31 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+3;",id);
	}
	const res = result.rowsOfObjects()
	console.log(res)
	let avg_sleepdur = []
	let avg_sleepquality = []
	let avg_sportstime = []
	let avg_mood = []
	let avg_studytime = []
	var i;

	for(i in res) {
		if(res[i].sleepduration) {
			avg_sleepdur.push(Number(res[i].sleepduration))
		}
		if(res[i].sleepquality) {
			avg_sleepquality.push(Number(res[i].sleepquality))
		}
		if(res[i].sportstime) {
			avg_sportstime.push(Number(res[i].sportstime))
		}
		if(res[i].studytime) {
			avg_studytime.push(Number(res[i].studytime))
		}
		if(res[i].mood) {
			avg_mood.push(Number(res[i].mood))
		}
	}
	avg_sleepquality = calcAverage(avg_sleepquality)
	avg_sleepdur = calcAverage(avg_sleepdur)
	avg_sportstime = calcAverage(avg_sportstime)
	avg_studytime = calcAverage(avg_studytime)
	avg_mood = calcAverage(avg_mood)
	
	return [res,avg_sleepdur,avg_sleepquality,avg_sportstime,avg_studytime,avg_mood]
}

const postRegis = async(request, response) => {
	const body = request.body();
	const params = await body.value;
	
	const email = params.get('email');
	const password = params.get('password');
	const verification = params.get('verification');
  
	if (password !== verification) {
	  response.body = 'The entered passwords did not match';
	  return;
	}
  
	const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
	if (existingUsers.rowCount > 0) {
	  response.body = 'The email is already reserved.';
	  return;
	}
  
	const hash = await bcrypt.hash(password);
	await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
	response.body = 'Registration successful!';
  };

const postLog = async(request, response, session) => {
	const body = request.body();
	const params = await body.value;
  
	const email = params.get('email');
	const password = params.get('password');
  
	// check if the email exists in the database
	const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
	if (res.rowCount === 0) {
		response.status = 401;
		return;
	}
  
	// take the first row from the results
	const userObj = res.rowsOfObjects()[0];
  
	const hash = userObj.password;
  
	const passwordCorrect = await bcrypt.compare(password, hash);
	if (!passwordCorrect) {
		response.status = 401;
		return;
	}
  
	await session.set('authenticated', true);
	await session.set('user', {
		id: userObj.id,
		email: userObj.email
	});
	response.body = 'Authentication successful!';
}

const handleLogout = async(response,session) => {
	await session.set("authenticated",false)
	await session.set('user','')
	response.redirect('/')
}

const isTodaySubmitted = async(id) => {
	
	const res = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time = CURRENT_DATE;",id)
	const data = res.rowsOfObjects()

	if(!data || data.length === 0) {
		return [false,false]
	}
	else {
		if(data.length === 1) {
			if(data[0].studytime) {
				return [false,true]
			}
			else {
				return [true,false]
			}
		}
		else {
			return [true,true]
		}
	}
}

export {handleLogout,isTodaySubmitted,postLog,postRegis,postMorningData, postEveningData,getSummaryWeekly, getSummaryMonthly } 
