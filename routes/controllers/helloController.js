import { getHello } from "../../services/helloService.js";
import { handleLogout,isTodaySubmitted,postLog,postRegis,postMorningData,postEveningData,getSummaryWeekly, getSummaryMonthly} from "../../services/mainService.js";

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
  
}

const postEvening = async({request,response,session}) => {
  const res = request.body()
  const data = await res.value

  const id = (await session.get('user')).id
  await postEveningData(data.get('studytime'),data.get('sportstime'),data.get('mood'),id,data.get('time'))
  response.status = 200

}

const fullSummary = async({render,session}) =>  {
  const id = (await session.get('user')).id
  const summary = await getSummaryWeekly(id)
  const summaryMonth = await getSummaryMonthly(id)
  const fullData = summary[0]
  const fullData2 = summaryMonth[0]
  summaryMonth.shift()
  summary.shift()
  console.log(id,"a")
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

const postLogout = async({response,session}) => {
  await handleLogout(response,session)
}

const showMain = async({render}) => {
  render('main.ejs')
}



export { postLogout,hello,postMorning,fullSummary,postEvening,showRegister,postRegister,showLogin, postLogin,showMain};
