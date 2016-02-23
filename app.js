var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
//var mongoStore = require('connect-mongo')(express);
var port = process.env.PORT || 2461;
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var moment = require('moment');
var dbUrl = 'mongodb://localhost/data';

mongoose.connect(dbUrl);


app.set('views', './app/views');
app.set('view engine', 'jade');

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(session({
    secret: 'touedo'
    //,
    //store: new mongoStore({
    //    url: dbUrl,
    //    collection: 'sessions'
    //})
}));

if ('development'=== app.get('env')){
    app.set('showStackError', true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/routes')(app);

app.listen(port);
app.locals.moment = require('moment');
app.use(express.static(path.join(__dirname, 'statics')));

console.log('TO UED DO started on port ' + port);



