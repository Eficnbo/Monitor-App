import { getHello } from "../../services/helloService.js";
import {postMorningData,getMorningSummary} from "../../services/mainService.js";

const hello = ({render}) => {
  render('index.ejs', { data: getHello() });
};

const postMorning = async({request,response}) => {
  const res = request.body()
  const data = await res.value
  console.log(data)
  await postMorningData(data.get('sleepduration'),data.get('sleepquality'),data.get('mood'),2)
  location = '/morning'    
}

const morningSummary = async({render}) =>  {
  const summary = await getMorningSummary()
  const fullData = summary[0]
  summary.shift()
	render('summary.ejs',{data: fullData,averages: summary});
}

export { hello,postMorning,morningSummary };
