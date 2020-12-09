import { Router } from "../deps.js";
import {showMain,showLogin,postLogin, hello,postMorning, postEvening,fullSummary,showRegister,postRegister,postLogout } from "./controllers/helloController.js";

const router = new Router();

router.get('/',showMain)
router.get('/auth/registration', showRegister)
router.post('/auth/registration', postRegister);
router.get('/auth/login',showLogin)
router.post('/auth/login',postLogin)
router.post('/auth/logout',postLogout)
router.get('/behavior/reporting', hello);
router.post('/behavior/morning',postMorning);
router.post('/behavior/evening',postEvening)
router.get('/behavior/summary',fullSummary);


export { router };
