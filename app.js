var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/');

// Express and routes
var app = express();
var router = express.Router();

// Add connection to the database of users
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient();
var url = 'mongodb://localhost:27017/usercollection';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var printUsers = function(req, res, next) {
	console.log("Will return the connections collection.")

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.find().toArray(function(res, err) {
			db.close();
			res.send();
			next();
		});
	});
};

app.post('/hello', printUsers);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(checkAuth);


function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
	if (req.url === '/secure' && (!req.session || !req.session.authenticated)) {
		res.render('unauthorised', { status: 403 });
		return;
	}

	next();
};

// Make dataase of users available to router
//
/*
app.use(function(req, res, next){
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Error");
            assert.equal(null, err);
        }
        req.db = db;
        next();
    });
});
*/

app.use(routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
/* GET Hello World page. */

app.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

