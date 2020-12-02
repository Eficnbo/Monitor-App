import { Router } from "../deps.js";
import { hello,postMorning,morningSummary } from "./controllers/helloController.js";

const router = new Router();

router.get('/morning', hello);
router.post('/morning',postMorning);
router.get('/morning/summary',morningSummary);

//router.get('/api/hello', helloApi.getHello);
//router.post('/api/hello', helloApi.setHello);

export { router };
