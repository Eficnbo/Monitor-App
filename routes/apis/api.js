import {getSummary,getSummaryDay} from "../../services/apiService.js"

const apiSummary = async({request,response}) => {
    response.body = await getSummary()
    response.status =200
}

const apiSummaryDay = async({request,response}) => {

    response.status =200
}

export {apiSummary,apiSummaryDay}