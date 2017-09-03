var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/Mapplication';

var favourites = require('./favourites')

var connections = [{ user_id: '10208598668754678',
       latitude: 44.447823,
       name: 'Tucano',
       locationType: 'CoffeeShop',
       longitude: 26.099713,
       address: 'Calea Dorobanți 18, București 030167',
       rating: 4.5,
       password: '',
       id: 'Tucano44.447823',
       created: '1496860505' },
     { user_id: '10208598668754678',
       latitude: 44.446808,
       name: 'PizzaHut',
       locationType: 'Restaurant',
       longitude: 26.098756,
       address: 'Calea Dorobanți 5, București 030167',
       rating: 5,
       password: 'pizzaHut2016',
       id: 'PizzaHut44.446808',
       created: '1496860505' },
     { user_id: '10208598668754678',
       latitude: 44.445506,
       name: 'The Embassy',
       locationType: 'Bar',
       longitude: 26.099554,
       address: 'Piaţa Lahovari 8, București 030167',
       rating: 3.5,
       password: '',
       id: 'The Embassy44.445506',
       created: '1496860505' },
     { user_id: '10208598668754678',
       latitude: 44.444594,
       name: 'McDonald\'s',
       locationType: 'Restaurant',
       longitude: 26.098385,
       address: 'Bulevardul General Gheorghe Magheru 24A, București 030167',
       rating: 3,
       password: 'RonaldMcDonalds!',
       id: 'McDonald\'s44.444594',
       created: '1496860505' },
     { user_id: '10208598668754678',
       latitude: 44.446448,
       name: 'Hotel Sheraton',
       locationType: 'Unknown',
       longitude: 26.099297,
       address: 'Calea Dorobantilor 5-7, Bucharest 010551',
       rating: 4.5,
       password: '',
       id: 'Hotel Sheraton44.446448',
       created: '1496860505' },
       { user_id: '11111111111111111',
       latitude: 44.444892,
       name: 'Shift Pub',
       locationType: 'Restaurant',
       longitude:  26.101669,
       address: 'Strada General Eremia Grigorescu 17, București 030167',
       rating: 4.5,
       password: 'AltshiftPub!2017',
       id: 'Shift Pub44.444892',
       created: '1496860505' },
       { user_id: '11111111111111111',
       latitude: 44.445178,
       name: '5 To Go',
       locationType: 'CoffeeShop',
       longitude:  26.101558,
       address: 'Strada General Eremia Grigorescu 22, București 030167',
       rating: 4.5,
       password: 'CoffeToGoLahovari',
       id: '5 To Go44.445178',
       created: '1496860505' }]

module.exports = {
	'clearConnections' : function(callback)
	{
		console.log("Will clear the connections collection.")

		MongoClient.connect(url, function(err, db) {
	  		assert.equal(null, err);
	  		clearConnectionsCollection(db, function() {
	    		db.close();
	    		callback();
	  		});
		})
	},
	'addTestConnections' : function()
	{
		console.log("Will add the collection of connections.")

		MongoClient.connect(url, function(err, db) {
	  		assert.equal(null, err);
	  		insertCollectionToMongoDB(db, connections, function() {
	    		db.close();
	    		favourites.initialiseFavouriteOption(connections);
	  		});
		})
	},
	'addConnection': function(req, res) 
	{
		console.log(JSON.stringify(req.body.params, null, 4))

		MongoClient.connect(url, function(err, db) {
	  		assert.equal(null, err);
	  		insertMongoDb(db, req.body.params, function() {
	    		db.close();
	  		});
		});

	 	res.send('Got a POST request')
	},
	'retrieveAllConnections': function(req, res)
	{
		MongoClient.connect(url, function(err, db){
			assert.equal(null, err);
			retrieveAllConnections(db, function(result){
				db.close();
				console.log("Retrieved the following from DB:");
				console.log(result);
				res.send(result);
			});
		});
	},
	'retrieveUserConnections' : function(req, res)
	{
		MongoClient.connect(url, function(err, db){
			assert.equal(null, err);
			console.log("Will retrieve information for userId: ",req.body.params.userId);
			retrieveUserConnections(db, req.body.params.userId, function(result){
				db.close();
				res.send(result);
			})
		});
	}
}

var insertMongoDb = function(db, data, callback)
{
	db.collection('connections').insertOne(data, function(err, result){
		assert.equal(err, null);
		console.log("Successfully inserted information to 'connections' collection.");
		callback();
	});
};

var insertCollectionToMongoDB = function(db, data, callback)
{
	db.collection('connections').insert(data, function(err, result){
		assert.equal(err, null);
		console.log("Successfully inserted information to 'connections' collection.");
		callback();
	})
}

var retrieveAllConnections = function(db, callback)
{
	db.collection('connections').find().toArray(function (error, result){
        if (error) 
        { 
        	console.log(error);
        }
        else if (result.length > 0)
        {
        	var resultDictionary = {"result": result}
        	callback(resultDictionary);
        }
    });
};

var retrieveUserConnections = function(db, userId, callback)
{
	db.collection('connections').find({'id' : userId}).toArray(function (error, result){
        if (error) 
        { 
        	console.log(error);
        }
        else if (result.length > 0)
        {
        	var resultDictionary = {"result": result}
        	callback(resultDictionary);
        }
    });
};

var clearConnectionsCollection = function(db, callback)
{
	db.collection('connections').remove({}, function(err, deleted) {
    	if (err)
    	{
    		console.log(error);
    	}
    	else if (deleted)
    	{
    		console.log("Collection has been deleted.");
    		callback();
    	}
  	});
};
