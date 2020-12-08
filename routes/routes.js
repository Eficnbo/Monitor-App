import { Router } from "../deps.js";
import { showLogin,postLogin, hello,postMorning, postEvening,fullSummary,showRegister,postRegister } from "./controllers/helloController.js";

const router = new Router();

router.get('/auth/register', showRegister)
router.post('/auth/register', postRegister);
router.get('/auth/login',showLogin)
router.post('/auth/login',postLogin)
router.get('/behavior/reporting', hello);
router.post('/behavior/morning',postMorning);
router.post('/behavior/evening',postEvening)
router.get('/behavior/summary',fullSummary);

//router.get('/api/hello', helloApi.getHello);
//router.post('/api/hello', helloApi.setHello);

export { router };
