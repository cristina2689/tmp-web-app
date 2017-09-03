var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient();
var url = 'mongodb://localhost:27017/usercollection';
var assert = require('assert');

router.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

router.get('/login', function(req, res){
    console.log("render", res.render);
  res.render('login', {
    title: 'Log in or register new account'
  });
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

