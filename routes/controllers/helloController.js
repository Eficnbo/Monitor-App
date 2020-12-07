import { getHello } from "../../services/helloService.js";
import {postMorningData,postEveningData,getMorningSummaryWeekly} from "../../services/mainService.js";

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

const morningSummary = async({render}) =>  {
  const summary = await getMorningSummaryWeekly()
  const fullData = summary[0]
  summary.shift()
	render('summary.ejs',{data: fullData,averages: summary});
}



export { hello,postMorning,morningSummary,postEvening };
