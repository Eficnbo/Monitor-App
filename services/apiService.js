import {executeQuery} from "../database/database.js"

const getSummary = async() => {
    //calculates the average of each variable over the past 7 days
    const result = await executeQuery("SELECT AVG(mood) as mood ,AVG(sportstime) as sportstime ,AVG(studytime) as studytime, AVG(sleepduration) as sleepduration, AVG(sleepquality) as sleepquality FROM data WHERE time BETWEEN CURRENT_DATE-make_interval(days := 7) AND CURRENT_DATE ")
    return result.rowsOfObjects()
}

const getSummaryDay = async() => {
    
}

export {getSummary,getSummaryDay}