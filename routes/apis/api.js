import {getSummary,getSummaryDay} from "../../services/apiService.js"

const apiSummary = async({response}) => {
    response.body = await getSummary()
    response.status =200
}

const apiSummaryDay = async({response,params}) => {
    response.body = await getSummaryDay(params.year,params.month,params.day)
    if(response.body.length === 0) {
        response.body = "No data for given day, perhaps wrong formatting?"
    }
    response.status = 200
}

export {apiSummary,apiSummaryDay}