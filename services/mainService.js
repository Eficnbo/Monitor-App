import {executeQuery} from '../database/database.js'

const postMorningData = async(sleepdur,sleepqua,mood,user_id) => {
	
	await executeQuery("INSERT INTO data(sleepduration,sleepquality,mood,user_id,time) VALUES($1,$2,$3,$4,NOW());",sleepdur,sleepqua,mood,user_id)
	
}

const getMorningSummary = async() => {
	const result = await executeQuery("SELECT * FROM data WHERE user_id = $1;",2);
	return result.rowsOfObjects();
}

export { postMorningData,getMorningSummary } 
