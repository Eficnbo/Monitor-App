import { getHello } from "../../services/helloService.js";
import {postLog,postRegis,postMorningData,postEveningData,getSummaryWeekly, getSummaryMonthly} from "../../services/mainService.js";

const hello = ({render}) => {
  render('index.ejs', { data: getHello() });
};

const postMorning = async({request,response,session}) => {
  const res = request.body()
  const data = await res.value
  const id = await session.get('user').id
  await postMorningData(data.get('sleepduration'),data.get('sleepquality'),data.get('mood'),id,data.get('time'))
  response.status = 200
  
}

const postEvening = async({request,response,session}) => {
  const res = request.body()
  const data = await res.value
  console.log(data.get('time'))
  const id = await session.get('user').id
  await postEveningData(data.get('studytime'),data.get('sportstime'),data.get('mood'),id,data.get('time'))
  response.status = 200

}

const fullSummary = async({render,session}) =>  {
  const id = await session.get('user').id
  const summary = await getSummaryWeekly(id)
  const summaryMonth = await getSummaryMonthly(id)
  const fullData = summary[0]
  const fullData2 = summaryMonth[0]
  summaryMonth.shift()
  summary.shift()
  
	render('summaryWeek.ejs',{data: fullData,averages: summary,data2: fullData2,averages2:summaryMonth});
}

const showRegister = ({render}) => {
  render('register.ejs');
}

const postRegister = async({request, response}) => {
  await postRegis(request,response)
};

const showLogin = ({render}) => {
  render('login.ejs');
}

const postLogin = async({request, response, session}) => {
  await postLog(request,response,session)
}



export { hello,postMorning,fullSummary,postEvening,showRegister,postRegister,showLogin, postLogin};
