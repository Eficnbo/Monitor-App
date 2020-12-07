import { Router } from "../deps.js";
import { hello,postMorning, postEvening,fullSummary } from "./controllers/helloController.js";

const router = new Router();

router.get('/behavior/reporting', hello);
router.post('/behavior/morning',postMorning);
router.post('/behavior/evening',postEvening)
router.get('/behavior/summary',fullSummary);

//router.get('/api/hello', helloApi.getHello);
//router.post('/api/hello', helloApi.setHello);

export { router };
