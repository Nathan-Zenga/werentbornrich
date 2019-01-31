const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http'); // core module
const path = require('path'); // core module
const session = require('express-session');
const ejs = require('ejs');

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
app.use('/shopify', require('./routes/shopify-install'));

const port = process.env.PORT;
app.listen(port, function() {
	console.log('Server started on port '+ port);
});