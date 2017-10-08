var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

require('dotenv').config();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {useMongoClient: true});

var passport = require('passport');
app.use(passport.initialize());

var initPassport = require('./passport/init');
initPassport(passport);

var logDir = process.env.LOG_DIR;
var winston = require('winston');
require('winston-mail');
require('winston-daily-rotate-file');


var fileTransport = new (winston.transports.DailyRotateFile)({
    filename: logDir + '/raisebetter.log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    timestamp: true,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});

var consoleTransport = new (winston.transports.Console)({
    timestamp: true,
    level: 'info'
});

var emailTransport = new (winston.transports.Mail)({
    username: process.env.GMAIL_USERNAME,
    password: process.env.GMAIL_PASSWORD,
    host: 'smtp.gmail.com',
    ssl: true,
    port: 465,
    level: 'error',
    to: 'nirav.shah83@gmail.com'
});

var wLogger = new (winston.Logger)({
    transports: [consoleTransport, fileTransport, emailTransport]
});

var index = require('./routes/index');
var posts = require('./routes/api/post')(passport);
var login = require('./routes/api/auth')(passport);
var stripe = require('./routes/api/stripe')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'public/dist/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(index);
app.use(login);
app.use(posts);
app.use(stripe);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {

    console.log('Global Error Handler 1 !!', err);
    wLogger.error(process.env.NODE_ENV + ':' + err.message, {
        env: process.env.NODE_ENV,
        err: err,
        url: req.originalUrl,
        headers: req.headers
    });

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {message: err.message});
});


app.locals.titlecase = function (str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

app.locals.formatDate = function (date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
};


var port = process.env.PORT || '8091';
app.set('port', port);

var server = http.createServer(app);
server.listen(port, function () {
    wLogger.info('API running on localhost: ' + port)
});
