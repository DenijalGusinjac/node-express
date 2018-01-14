var express = require('express');
var router = express.Router();
//var expressValidator = require('express-validator');

var bcrypt = require('bcrypt');
const saltRounds = 10;

var passport = require('passport');

//GET HOME
router.get('/',function(req, res, next){
	res.render('index', {title: 'Registration form'})
});
//GET LOGIN
router.get('/login',function(req, res, next){
	res.render('login', {title: 'Login'})
});

//POST LOGIN
router.post('/login',passport.authenticate(
	'local',{
		failureRedirect: '/login',

	}),
	function(req, res) {

		const db = require('../db.js');
		const user_id = req.session.passport.user.user_id;
		db.query("SELECT role_id, id FROM users WHERE id = "+user_id,function(error, results, fields){
			if (error) throw error;
			if(results[0].role_id == 2){
				return res.redirect ('/user/profile')
			}else{
				return res.redirect ('/admin/profile')
			}
		});

		//if (req.user.isNew) { return res.redirect('/back_again'); }
		//res.redirect('/welcome');
	});

//GET LOGOUT
router.get('/logout',function(req, res, next){
	req.logout()
	req.session.destroy();
	res.redirect('/');
});

//GET REGISTER
router.get('/register',function(req, res, next){
	res.render('register', {title: 'Registration form'})
});

//POST REGISTER
router.post('/register',function(req, res, next){
	
	req.checkBody('username', 'Email field require').notEmpty()
	req.checkBody('username', 'Email field must be in type of email').isEmail()
	req.checkBody('password', 'Password field require').notEmpty()
	req.checkBody('password', 'Password must be between 6-50 characters long').len(6,50)
	req.checkBody('first_name', 'First name field require').notEmpty()
	req.checkBody('last_name', 'Last name field require').notEmpty()

	const errors = req.validationErrors();

	if(errors){

		res.render('register', {
			title: "Registration error", 
			errors: errors
		})
	}else{

		const db = require('../db.js');
		const username = req.body.username;
		const password = req.body.password;
		const firstName = req.body.first_name;
		const lastName = req.body.last_name;

		// using prepared statment to secure register data from sql attack.
		bcrypt.hash(password, saltRounds, function(err, hash){
			db.query("INSERT INTO users (email, password, first_name, last_name, role_id) VALUES(?, ?, ?, ?, ?)", [username, hash, firstName, lastName, 2], function (error, results, fields) {
				if (error) throw error;
			});

			db.query("SELECT LAST_INSERT_ID() as user_id",function(error, results, fields){
				if (error) throw error;

				const user_id = results[0];
				req.login(results[0], function(err){
					res.redirect('/user/profile');
				});
				res.render('register', {title: 'Register Complete'})
			})

		});
	}


});

passport.serializeUser(function(user_id, done) {
	done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
		done(null, user_id);
});

//function authenticationMiddleware () {
//	return (req, res, next) => {
//		if (req.isAuthenticated()) return next();
//		res.redirect('/login')
//	}
//}
//function authenticationAdministrationMiddleware () {
//	return (req, res, next) => {
//		console.log(req.isAdmin)
//		if (req.isAdmin) return next();
//		//const db = require('../db.js');
//		//const user_id = req.session.passport.user.user_id;
//		//db.query("SELECT role_id, id FROM users WHERE id = "+user_id,function(error, results, fields){
//		//	if (error) throw error;
//		//	if(results[0].role_id == 2){
//		//		res.render('myprofile', {title: 'MY profile'})
//		//	}else{
//		//		res.render('admin/administration', {title: 'Administration'})
//		//	}
//        //
//        //
//		//});
//
//		res.redirect('/login')
//	}
//}


module.exports = router;