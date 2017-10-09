var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
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
require('winston-mongodb');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public/dist/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


/*var consoleTransport = new (winston.transports.Console)({
 timestamp: true,
 level: 'info'
 });*/

var fileTransport = new (winston.transports.DailyRotateFile)({
    filename: logDir + '/raisebetter.log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    timestamp: true,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});

var emailTransport = new (winston.transports.Mail)({
    username: process.env.GMAIL_USERNAME,
    password: process.env.GMAIL_PASSWORD,
    host: 'smtp.gmail.com',
    ssl: true,
    port: 465,
    level: 'error',
    to: process.env.ERROR_REPORT_EMAIL
});

var mongodbTransport = new (winston.transports.MongoDB)({
    level: 'warn',
    db: process.env.MONGO_URL,
    collection: 'error_logs'
});

var wLogger = new (winston.Logger)({
    transports: [fileTransport, emailTransport, mongodbTransport],
    exceptionHandlers: [emailTransport]
});

var index = require('./routes/index');
var posts = require('./routes/api/post')(passport);
var login = require('./routes/api/auth')(passport);
var stripe = require('./routes/api/stripe')(passport);

app.use(index);
app.use(login);
app.use(posts);
app.use(stripe);

var mongo_express = require('mongo-express/lib/middleware');
var me_config = require('./me_config');
app.use('/mongo_express', mongo_express(me_config));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {

    wLogger.error(process.env.NODE_ENV + ':' + err.message + ':' + req.originalUrl, {
        url: req.originalUrl,
        headers: req.headers
    });

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

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
