import { getHello } from "../../services/helloService.js";
import { isTodaySubmitted,postMorningData,postEveningData,getSummaryWeekly, getSummaryMonthly,getTrend} from "../../services/reportingService.js";
import {handleLogout,postRegis,postLog} from "../../services/userService.js"
const hello = async({render,session}) => {

  const id = (await session.get('user')).id
  render('index.ejs', { submitted:await isTodaySubmitted(id) });
};

const postMorning = async({request,response,session}) => {
  const res = request.body()
  const data = await res.value
  const id = (await session.get('user')).id
  await postMorningData(data.get('sleepduration'),data.get('sleepquality'),data.get('mood'),id,data.get('time'))
  response.status = 200
  response.redirect("/behavior/reporting")
}

const postEvening = async({request,response,session}) => {
  const res = request.body()
  const data = await res.value

  const id = (await session.get('user')).id
  await postEveningData(data.get('studytime'),data.get('sportstime'),data.get('mood'),id,data.get('time'))
  response.status = 200
  response.redirect("/behavior/reporting")
}

const fullSummary = async({request,render,session}) =>  {
  const res = request.body()
  const data = await res.value
  const params = new URLSearchParams(request.url.search);

  const id = (await session.get('user')).id
  const summary = await getSummaryWeekly(id,params)
  const summaryMonth = await getSummaryMonthly(id,params)
  const fullData = summary[0]
  const fullData2 = summaryMonth[0]
  summaryMonth.shift()
  summary.shift()

	render('summaryWeek.ejs',{data: fullData,averages: summary,data2: fullData2,averages2:summaryMonth});
}

const showRegister = ({render}) => {
  render('register.ejs',{errors: "",email:''});
}

const postRegister = async({request, response,render}) => {
  await postRegis(request,response,render)
};

const showLogin = ({render}) => {
  render('login.ejs',{data:true});
}

const postLogin = async({request, response, session,render}) => {
  await postLog(request,response,session,render)
}

const postLogout = async({response,session}) => {
  await handleLogout(response,session)
}

const showMain = async({render,session}) => {
  const a  = await session.get("authenticated")

  render('main.ejs',{auth:a,mood: await getTrend(session)})
}



export { postLogout,hello,postMorning,fullSummary,postEvening,showRegister,postRegister,showLogin, postLogin,showMain};
