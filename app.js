var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	http = require('http'), // core module
	path = require('path'), // core module
	session = require('express-session'),
	mongoose = require('mongoose'),
	ejs = require('ejs'),
	s3 = null;

require('dotenv').config();

// let conn = mongoose.connection;
// mongoose.connect(s3 ? s3.DB : process.env.DB);

// conn.once('open', () => { console.log('Connected to db'); });
// conn.on('error', (err) => { console.log(err); });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Express session middleware
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Global variables
app.use(function (req, res, next) {
	res.locals.url = req.url;
	next();
});

app.use('/', require('./routes/index'));

const port = process.env.PORT;
app.listen(port, function() {
	console.log('Server started on port '+ port);
});