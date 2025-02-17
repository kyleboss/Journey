module.exports = function(T) {
    var twitter = {}

    twitter.getPreviousTweet = function(tweetDest, socket) {
        T.get('statuses/user_timeline', { user_id: tweetDest["user"]["id"], count: 2 },
            function(err, data, response) {
                var tweetOrig;
                var isFirstTweet = twitter.isFirstTweet(data)
                if (!isFirstTweet) {
                    if (data[0] == undefined) {
                        console.log(data);
                    } else {
                        console.log(data[0]["text"] + "\n**" + data[1]["text"])
                        tweetOrig = data[1];
                        var geoEnabledTweetDest = twitter.isGeoEnabled(tweetDest)
                        var geoEnabledTweetOrig = twitter.isGeoEnabled(tweetOrig)
                        var geoEnabled = geoEnabledTweetDest && geoEnabledTweetOrig;

                        if (geoEnabled) {
                            var coordDest = tweetDest["coordinates"]["coordinates"]
                            var coordOrig = tweetOrig["coordinates"]["coordinates"]
                            var tweetDist = twitter.getDistance(coordOrig, coordDest)
                            console.log(tweetDist)
                            console.log("\n\n\n\n")
                            var isFlight = twitter.isFlight(tweetDist)
                            if (isFlight) {
                                // Construct a new tweet object
                                var tweet = {
                                    time_created: Date.now(),
                                    twid: data[0]['id'],
                                    text: data[0]['text'],
                                    name: data[0]['user']['name'],
                                    screen_name: data[0]['user']['screen_name'],
                                    profile_image_url: data[0]['user']['profile_image_url'],
                                    origLat: coordOrig[1],
                                    origLong: coordOrig[0],
                                    destLat: coordDest[1],
                                    destLong: coordDest[0]
                                };

                                // Create a new model instance with our object
                                var tweetEntry = new Tweet(tweet);

                                // Save 'er to the database
                                tweetEntry.save(function (err) {
                                    if (!err) {
                                        // If everything is cool, socket.io emits the tweet.
                                        socket.emit('info', {tweet: tweetDest});
                                    } else {
                                        console.log("Made it to the very end...then errored (DB?)")
                                        console.log(err)
                                    }
                                });
                            } else {
                                console.log("Not far enough to be a flight.")
                            }
                        } else {
                            console.log("NOT GEOENABLED")
                        }
                    }
                } else {
                    console.log("isFirstTweet: " + isFirstTweet)
                }
            }
        )
    }

    twitter.toRadians = function(degree) {
        return degree * (Math.PI/180)
    }

    twitter.getDistance = function(geo1, geo2) {
        var lat1 = geo1[1]
        var lat2 = geo2[1]
        var lon1 = geo1[0]
        var lon2 = geo2[0]
        var R = 3959;
        var φ1 = twitter.toRadians(lat1);
        var φ2 = twitter.toRadians(lat2);
        var Δφ = twitter.toRadians(lat2-lat1);
        var Δλ = twitter.toRadians(lon2-lon1);

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;
        return d
    }

    twitter.isGeoEnabled = function(tweet) {
        // console.log("RETURNINGL: " + tweet["user"]["geo_enabled"])
        try {
            console.log(tweet["coordinates"])
            return tweet["coordinates"] != null
        } catch (e) {
            console.log(tweet)
            throw new Error (e)
        }
    }

    twitter.isFlight = function(distance) {
        return distance > 100
    }

    twitter.isFirstTweet = function(tweets) {
        return tweets.length == 1
    }

    return twitter
}