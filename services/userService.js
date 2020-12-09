import {executeQuery} from '../database/database.js'
import {bcrypt} from "../deps.js"

const postRegis = async(request, response,render) => {
	const body = request.body();
	const params = await body.value;
	
	const email = params.get('email');
	const password = params.get('password');
	const verification = params.get('verification');
    if(!email.includes("@")) {
        render('register.ejs',{errors:"Email is not valid",email:email})
        return;
    }

	if (password !== verification) {
      response.body = 'The entered passwords did not match';
      render('register.ejs',{errors:"Passwords did not match",email:email})
	  return;
	}
    
    if(password.length < 4) {
        render('register.ejs',{errors:"Password length should be atleast 4 characters.",email:email})
        return
    }

	const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
	if (existingUsers.rowCount > 0) {
        render('register.ejs',{errors:"The email already exists in the database",email:email})
        return
	}
  
	const hash = await bcrypt.hash(password);
	await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
    response.body = 'Registration successful!';
    response.redirect('/')
  };

const postLog = async(request, response, session,render) => {
	const body = request.body();
	const params = await body.value;
  
	const email = params.get('email');
	const password = params.get('password');
  
	// check if the email exists in the database
	const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
	if (res.rowCount === 0) {
		response.status = 401;
		render('login.ejs',{data: false})
		return;
	}
  
	// take the first row from the results
	const userObj = res.rowsOfObjects()[0];
  
	const hash = userObj.password;
  
	const passwordCorrect = await bcrypt.compare(password, hash);
	if (!passwordCorrect) {
		response.status = 401;
		render('login.ejs',{data: false})
		return;
	}
  
	await session.set('authenticated', true);
	await session.set('user', {
		id: userObj.id,
		email: userObj.email
	});
	response.body = 'Authentication successful!';
	response.redirect('/')
}

const handleLogout = async(response,session) => {
	await session.set("authenticated",false)
	await session.set('user','')
	response.redirect('/')
}

export { handleLogout, postLog, postRegis }