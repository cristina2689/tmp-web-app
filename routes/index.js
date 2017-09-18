var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient();
var url = 'mongodb://localhost:27017/usercollection';
var assert = require('assert');
var flash = require('connect-flash');

router.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

router.get('/login', function(req, res){
    console.log("render", res.render);
    console.log("Req", req);
  res.render('login', {
    title: 'Log in or register new account'
  });
});
router.get('/event', function(req, res) {
    res.render('event.jade', {title: 'Event'})
});

router.post('/login', function (req, res, next) {
    console.log("database", req);

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('usercollection').find().toArray(function(err, response) {
            assert.equal(null, err);
            var x = response.findIndex(function(element) {
                return (element.username == req.body.username && element.password == req.body.password);
            });
            console.log("x is", response[x]);
            if (x >= 0) {
                if (response[x].username === 'admin') {
                    res.render('admin', {
                        "data" : response[x]
                    });
                }
                res.render('profile', {
                    "data" : response[x]
                });
            } else {
                res.redirect('/login');
            }
            db.close(); /* This should be async since we took the data already, no */

    });
        /*
		if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
			req.session.authenticated = true;
            console.log("Req session", req.session.authenticated);
			res.redirect('/secure');
		} else {
            req.flash('error', "Username and pass are incorrect");
			res.redirect('/login');
		}
        */
	});
});

router.get('/secure', function (req, res, next) {
		res.render('secure');
});

router.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		res.redirect('/');
});


router.get('/welcome', function (req, res, next) {
		res.render('welcome');
});

router.get('/userlist', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('test').find().toArray(function(err, response) {
            assert.equal(null, err);
            res.render('userlist', {
                "userlist" : response
            });
            db.close(); /* This should be async since we took the data already, no */
        });
    });
});

router.get('/events', function(req, res) {
    console.log("Events");
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('events').find().toArray(function(err, response) {
            console.log("Events", response);
            assert.equal(null, err);
            res.render('events', {
                "events" : response
            });
            db.close(); // This should be async since we took the data already, no
        });
    });
});

router.get('/newuser', function(req, res) {
    console.log('render', res.render);
    res.render('newuser', {title: 'Register User'});
});


// POST form response to usercollection

router.post('/adduser', function(req, res) {
    var data = {};
    data.username = req.body.username;
    data.email = req.body.useremail;
    data.password = req.body.password;

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        db.collection('usercollection').insertOne(data, function(err, response) {
            if (err) {
                res.send("Problem with POST in adduser");
            } else {
                res.redirect("userlist");
            }
        });
    });
});



module.exports = router;

