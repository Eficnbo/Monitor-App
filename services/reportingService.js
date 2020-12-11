import {executeQuery} from '../database/database.js'

const postMorningData = async(sleepdur,sleepqua,mood,user_id,time) => {

	const today = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time = CURRENT_DATE;",user_id)
	if(!today || today.rowsOfObjects().length === 0) {
		await executeQuery("INSERT INTO data(sleepduration,sleepquality,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",sleepdur,sleepqua,mood,user_id,time)
	}
	else {
		
		await executeQuery("DELETE FROM data WHERE user_id = $1 AND time = CURRENT_DATE AND sleepduration IS NOT NULL;",user_id)
		await executeQuery("INSERT INTO data(sleepduration,sleepquality,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",sleepdur,sleepqua,mood,user_id,time)
	}
}

const postEveningData = async(studytime,sportstime,mood,user_id,time) => {
	
	const today = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time = CURRENT_DATE;",user_id)
	if(!today || today.rowsOfObjects().length === 0) {
		await executeQuery("INSERT INTO data(studytime,sportstime,mood,user_id,time) VALUES($1,$2,$3,$4,$5);",studytime,sportstime,mood,user_id,time)
	}
	else {

			await executeQuery("DELETE FROM data WHERE user_id = $1 AND time = CURRENT_DATE AND studytime IS NOT NULL;",user_id)
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

const getSummaryWeekly = async(id,params,response) => {
	let date,result;
	if(params.get('week')) {
		date = (params.get('week'))
		date = date.split('-')
		const year = Number(date[0])
		let week;
		if(date[1]) {
			week = Number(date[1].substring(1))
		}
		else {
			week = "?"
		}
                if(!Number.isInteger(week) || week > 52 || week < 0) {
                        response.body = "Invalid week, must be number or between 1 and 12: format example= 2020-W49"
                }
                if(!Number.isInteger(year) || year > 2100 || year< 2000) {
                        response.body = "Invalid year, must be number or between 2000 and 2100: format example= 2020-W49"
                }

		date = getDateOfISOWeek(week,year)
		var today = new Date();
		const number1 = days_between(today,date)
		const numb2 = 7+number1
		result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN (CURRENT_DATE-make_interval(days := $2)) AND (CURRENT_DATE-make_interval(days := $3));",id,numb2,number1)	
	}
	else {
	//query for last 7 days of data:
		result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN (CURRENT_DATE-make_interval(days := 7)) AND (CURRENT_DATE);",id)
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

const getSummaryMonthly = async(id,params,response) => {
	let date,result;
	if(params.get('month')) {
		date = (params.get('month'))
	        date = date.split('-')
                const year = Number(date[0])
                const month = Number(date[1])

		if(!Number.isInteger(month) || month > 12 || month < 0) {
			response.body = "Invalid month, must be number or between 1 and 12: format example= 2020-11"
		}
                if(!Number.isInteger(year) || year > 2100 || year< 2000) {
                        response.body = "Invalid year, must be number or between 2000 and 2100: format example= 2020-W49"
                }

		date = new Date(year,month-1,1)
		var today = new Date();
		const number1 = days_between(today,date)
		const number3 =number1
		const number2 = (31-number1)
		result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN (CURRENT_DATE-make_interval(days := $2)) AND (CURRENT_DATE+make_interval(days := $3));",id,number3,number2);
		//result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN CURRENT_DATE-EXTRACT(DOW FROM NOW())::INTEGER-$2 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+$3;",id,number1,number2);
	}
	else {
	//query for last 7 days of data:
	//const result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+2;",2);
		result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN (CURRENT_DATE-make_interval(days := 31)) AND (CURRENT_DATE);",id);

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

const getTrend = async(session) => {
	let id = (await session.get('user'))
	if(!id) {
		return ""
	}
	else {
		id = id.id
	}
	const res1 = await executeQuery("SELECT * FROM data WHERE time=CURRENT_DATE AND user_id=$1;",id)
	const res2 = await executeQuery("SELECT * FROM data WHERE time=CURRENT_DATE-make_interval(days := 1) AND user_id=$1;",id)

	if(res1.rowsOfObjects()[0] && res1.rowsOfObjects()[1] && res2.rowsOfObjects()[1] &&res2.rowsOfObjects()[0]) {
		const data1 = (Number(res1.rowsOfObjects()[0].mood) + Number(res1.rowsOfObjects()[1].mood))/2
		const data2 = (Number(res2.rowsOfObjects()[0].mood) + Number(res2.rowsOfObjects()[1].mood))/2
		if(!data1 || !data2) {
			return "Report your data two days in a row to get your feeling message(morning and evening data)!"
		}
		if(data1 < data2) {
			return "Things are looking gloomy today! Your average mood is worse than yesterday! Users' average was: "+data1+ "!"
		}
		else {
			return "Things are looking bright today! Your mood is better than yesterday(or same)! Users' average was: "+data1+ "!"
		}
	}
	else {
		return "You must post two days in a row your morning and evening data in order to get your feeling message!"
	}
}

const getAllMood = async() =>  {
	const result = await executeQuery("SELECT mood FROM data LIMIT 5;")
	return result.rowsOfObjects()
}



export {getAllMood,isTodaySubmitted,postMorningData, postEveningData,getSummaryWeekly, getSummaryMonthly,getTrend, days_between,calcAverage } 
