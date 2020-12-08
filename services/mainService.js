import {executeQuery} from '../database/database.js'
import {bcrypt} from "../deps.js"
const postMorningData = async(sleepdur,sleepqua,mood,user_id,time) => {
	console.log(time)
	await executeQuery("INSERT INTO data(sleepduration,sleepquality,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",sleepdur,sleepqua,mood,user_id,time)
	
}

const postEveningData = async(studytime,sportstime,mood,user_id,time) => {
	
	await executeQuery("INSERT INTO data(studytime,sportstime,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",studytime,sportstime,mood,user_id,time)
	
}

const calcAverage = (dat) => {
	if(!dat || dat.length == 0 ){
		return 0
	}
	return dat.reduce((a, b) => a + b, 0)/dat.length
}

const getSummaryWeekly = async(id) => {
	//query for last 7 days of data:
	//const result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+2;",2);
	const result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN CURRENT_DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+2;",id);
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

const getSummaryMonthly = async(id) => {
	//query for last 7 days of data:
	//const result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+2;",2);
	const result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN CURRENT_DATE-EXTRACT(DOW FROM NOW())::INTEGER-30 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+2;",id);
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
		respnse.status = 401;
		return;
	}
  
	await session.set('authenticated', true);
	await session.set('user', {
		id: userObj.id,
		email: userObj.email
	});
	response.body = 'Authentication successful!';
  }
export {postLog,postRegis,postMorningData, postEveningData,getSummaryWeekly, getSummaryMonthly } 
