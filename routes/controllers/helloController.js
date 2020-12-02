import { getHello } from "../../services/helloService.js";
import {postMorningData,getMorningSummary} from "../../services/mainService.js";

const hello = ({render}) => {
  render('index.ejs', { hello: getHello() });
};

const postMorning = async({request,response}) => {
  const res = request.body()
  const data = await res.value
  console.log(data)
  await postMorningData(data.get('sleepduration'),data.get('sleepquality'),data.get('mood'),2)    
}

const morningSummary = async({render}) =>  {
	render('index.ejs',{data:await getMorningSummary()});
}

export { hello,postMorning,morningSummary };
