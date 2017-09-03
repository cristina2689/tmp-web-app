var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/Mapplication';

var connections = require('./connections')

module.exports = {
	'initialiseFavouriteOption': function(data) 
	{
		MongoClient.connect(url, function(err, db){
	  		assert.equal(null, err);

	  		// Fetch all the documents in connections collection and build favourites collection (should be called once)
	  		retrieveAllConnections(db, function(result){
	  			// For each location add it into favourites collection
	  			result.forEach(function(element){
	  				console.log("ELEMENT", element);
	  				var data = {"id" : element["id"], "favouriteFor" : []}
	  				insertMongoDb(db, data, function(){
	  					db.close();
	  				});
	  			});
	  		});
	  	});
	},
	'addFavourite': function(req, res)
	{
		MongoClient.connect(url, function(err, db) {
	  		assert.equal(null, err);
	  		addFavourite(db, req.body.params, function(){
	  			db.close();
	  		});
	  	});
	},
	'removeFavourite' : function(req, res)
	{
		MongoClient.connect(url, function(err, db) {
	  		assert.equal(null, err);
	  		removeFavourite(db, req.body.params, function(){
	  			db.close();
	  		})
	  	});
	},
	'isUsersFavourite' : function(req, res)
	{
		MongoClient.connect(url, function(err, db){
			assert.equal(null, err);
			console.log("Will retrieve favourite information for userId ", req.body.params.user_id, " and id ", req.body.params.id);
			isUsersFavourite(db, req.body.params.id, req.body.params.user_id, function(result){
				db.close();
				res.send(result);
			})
		});
	}
};

var insertMongoDb = function(db, data, callback)
{
	db.collection('favourites').insertOne(data, function(err, result){
		assert.equal(err, null);
		console.log("Successfully inserted information to 'favourites' collection.");
		callback();
	});
};

var insertCollectionToMongoDB = function(db, data, callback)
{
	db.collection('favourites').insert(data, function(err, result){
		assert.equal(err, null);
		console.log("Successfully inserted information to 'favourites' collection.");
		callback();
	})
}

var addFavourite = function(db, data, callback)
{
	db.collection('favourites').update({id: data.id}, { $push: { favouriteFor: data.user_id } }, function(err, added) {
      if( err || !added ) 
      {
        console.log("Favourite not added.");
        callback();
      }
      else 
      {
        console.log("Favourite added.");
        callback();
        }
    });
}

var removeFavourite = function(db, data, callback)
{
	db.collection('favourites').update({id: data.id}, { $pull: { favouriteFor: data.user_id } }, function(err, removed) {
      if( err || !removed ) 
      {
        console.log("Favourite not removed.");
        callback();
      }
      else 
      {
        console.log("Favourite removed.");
        callback();
        }
    });
}

var isUsersFavourite = function(db, locationId, userId, callback)
{
	db.collection('favourites').find({'id' : locationId}).toArray(function (error, result){
        if (error) 
        { 
        	console.log(error);
        }
        else if (result.length > 0)
        {
        	var isFavourite = 0
        	var favouriteUsers = result[0]["favouriteFor"]

        	for (var user in favouriteUsers)
        	{
        		if (favouriteUsers[user] == userId)
        		{
        			isFavourite = 1
        		}
        	}
        	var isFavouriteDict = {}
        	isFavouriteDict["isFavourite"] = isFavourite;
        	var resultDictionary = {"result": isFavouriteDict}
        	callback(resultDictionary);
        }
    });
};

var retrieveAllConnections = function(db, callback)
{
	db.collection('connections').find().toArray(function (error, result){
        if (error) 
        { 
        	console.log(error);
        }
        else if (result.length > 0)
        {
        	//var resultDictionary = {"result": result}
        	callback(result);
        }
    });
};