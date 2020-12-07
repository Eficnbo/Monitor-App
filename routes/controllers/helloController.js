import { getHello } from "../../services/helloService.js";
import {postMorningData,postEveningData,getSummaryWeekly, getSummaryMonthly} from "../../services/mainService.js";

const hello = ({render}) => {
  render('index.ejs', { data: getHello() });
};

const postMorning = async({request,response}) => {
  const res = request.body()
  const data = await res.value
  await postMorningData(data.get('sleepduration'),data.get('sleepquality'),data.get('mood'),2,data.get('time'))
  response.status = 200
  
}

const postEvening = async({request,response}) => {
  const res = request.body()
  const data = await res.value
  console.log(data.get('time'))
  await postEveningData(data.get('studytime'),data.get('sportstime'),data.get('mood'),2,data.get('time'))
  response.status = 200

}

const fullSummary = async({render}) =>  {
  const summary = await getSummaryWeekly()
  const summaryMonth = await getSummaryMonthly()
  const fullData = summary[0]
  const fullData2 = summaryMonth[0]
  summaryMonth.shift()
  summary.shift()
	render('summaryWeek.ejs',{data: fullData,averages: summary,data2: fullData2,averages2:summaryMonth});
}


export { hello,postMorning,fullSummary,postEvening };
