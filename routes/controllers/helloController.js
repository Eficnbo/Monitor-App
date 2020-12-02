import { getHello } from "../../services/helloService.js";
import {postMorningData} from "../../services/mainService.js";

const hello = ({render}) => {
  render('index.ejs', { hello: getHello() });
};

const postMorning = async({request,response}) => {
  const res = request.body()
  const data = await res.value
  console.log(data)
  postMorningData(data.get('sleepduration'),data.get('sleepquality'),data.get('mood'),2)    
}

export { hello,postMorning };
