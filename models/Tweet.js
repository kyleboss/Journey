var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    created_at        : String
    , twid              : String
    , text              : String
    , name              : String
    , screen_name       : String
    , profile_image_url : String
    , origLat           : String
    , origLong          : String
    , destLat           : String
    , destLong          : String
});

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function(page, skip, callback) {

    var tweets = [],
        start = (page * 10) + (skip * 1);

    // Query the db, using skip and limit to achieve page chunks
    Tweet.find({},'twid active author avatar body date screen_name',{}).sort({date: 'desc'}).exec(function(err,docs){

        // If everything is cool...
        if(!err) {
            tweets = docs;  // We got tweets
            tweets.forEach(function(tweet){
                tweet.active = true; // Set them to active
            });
        }

        // Pass them back to the specified callback
        callback(tweets);

    });

};

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweetsFromDb = function(callback) {

    var tweets = [];

    // Query the db, using skip and limit to achieve page chunks
    Tweet.find({},'twid name profile_image_url text created_at screen_name origLat origLong destLat destLong',{}).sort({date: 'desc'}).exec(function(err,docs){

        // If everything is cool...
        if(!err) tweets = docs;  // We got tweets

        // Pass them back to the specified callback
        var formattedTweets = {timeBins: [{data: [], t: 1992}]};
        for (var i = 0; i<tweets.length; i++) {
            tweets[i]["v"] = 3000000;
            formattedTweets["timeBins"][0]["data"].push(tweets[i]);
        }
        callback(formattedTweets);

    });

};

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);