import {executeQuery} from '../database/database.js'

const postMorningData = async(sleepdur,sleepqua,mood,user_id) => {
	
	await executeQuery("INSERT INTO data(sleepduration,sleepquality,mood,user_id,time) VALUES($1,$2,$3,$4,NOW());",sleepdur,sleepqua,mood,user_id)
	
}

export { postMorningData } 
