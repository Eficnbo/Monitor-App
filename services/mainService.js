import {executeQuery} from '../database/database.js'

const postMorningData = async(sleepdur,sleepqua,mood,user_id) => {
	
	await executeQuery("INSERT INTO data(sleepduration,sleepquality,mood,user_id,time) VALUES($1,$2,$3,$4,NOW());",sleepdur,sleepqua,mood,user_id)
	
}

const calcAverage = (dat) => {
	if(!dat || dat.length == 0 ){
		return 0
	}
	return dat.reduce((a, b) => a + b, 0)/dat.length
}

const getMorningSummary = async() => {
	//query for last 7 days of data:
	const result = await executeQuery("SELECT * FROM data WHERE user_id = $1 AND time BETWEEN NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7 AND NOW()::DATE-EXTRACT(DOW from NOW())::INTEGER+2;",2);
	const res = result.rowsOfObjects()
	let avg_sleepdur = []
	let avg_sleepquality = []
	let avg_sportstime = []
	let avg_mood = []
	let avg_studytime = []
	var i;
	var z;
	console.log(res)
	for(i in res) {
		console.log(res[i])
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

export { postMorningData,getMorningSummary } 
