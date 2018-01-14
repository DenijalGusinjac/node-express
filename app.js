var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');

var index = require('./routes/index')

var app = express();


var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;





//Authentication package
var MySQLStore = require('express-mysql-session')(session);

require('dotenv').config();
// var logger = function (req, res, next) {
// 	console.log('Logginin');
// 	next();
// }

// app.use(logger);

//VIew engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Express validator
app.use(expressValidator());


// Set Static Path
app.use(express.static(path.join(__dirname,'public')))


var options = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
};


var sessionStore = new MySQLStore(options);

app.use(session({
	secret: 'dasihasdnoadn',
	resave: false,
	store:sessionStore,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req ,res , next){
	res.locals.isAuthenticated =req.isAuthenticated();
	next();
})

//All routs /admin
var admin = express.Router();
require('./routes/admin')(admin, passport);
app.use('/admin', admin);

//All routs /user
var user = express.Router();
require('./routes/user')(user, passport);
app.use('/user', user);



app.use ('/', index);

passport.use(new LocalStrategy(
	function(username, password, done) {
		const db = require('./db');
		db.query("SELECT id, password FROM users WHERE email =?",[username], function (err, results, fields) {
			if(err){done(err);}
			if(results.length === 0){
				 done(null, false)
			}else{
				const hash = results[0].password.toString();

				bcrypt.compare(password, hash, function(err, response){
					if(response === true){
						return done(null, {user_id:results[0].id});
					}else{
						return done(null, false)
					}
				})
			}

		})

	}
));



app.listen(3000, function(){
	console.log('Server started on port 3000')
})