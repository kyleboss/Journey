module.exports = function(T) {
	var twitter = {}

	twitter.getPreviousTweet = function(tweetDest, socket) {
		T.get('statuses/user_timeline', { user_id: tweetDest["user"]["id"], count: 2 }, 
			function(err, data, response) {
				var tweetOrig
				var isFirstTweet = twitter.isFirstTweet(data)
				if (!isFirstTweet) {
					if (data[0] == undefined) {
						console.log(data)
						throw new Error ()
					}
		  			console.log(data[0]["text"] + "\n**" + data[1]["text"])
		  			tweetOrig 				= data[1]
					var geoEnabledTweetDest = twitter.isGeoEnabled(tweetDest)
					var geoEnabledTweetOrig = twitter.isGeoEnabled(tweetOrig)
					var geoEnabled 			= geoEnabledTweetDest && geoEnabledTweetOrig
					console.log("GEO")
					console.log(geoEnabledTweetDest)
					console.log(geoEnabledTweetOrig)
					console.log(geoEnabledTweetDest && geoEnabledTweetOrig)
					console.log(geoEnabled)
					if (geoEnabled) {
						console.log(tweetDest)
						var coordDest 	= tweetDest["geo"]["coordinates"]
						var coordOrig 	= tweetOrig["geo"]["coordinates"]
						var tweetDist 	= twitter.getDistance(coordOrig, coordDest)
						console.log(tweetDist)
						console.log("\n\n\n\n")
						var isFlight 	= twitter.isFlight(tweetDist)
						if (isFlight) socket.emit('info', { tweet: tweetDest});
					} else {
						console.log("geoEnabled: " + geoEnabled)
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
		var lat1 = geo1[0]
		var lat2 = geo2[0]
		var lon1 = geo1[1]
		var lon2 = geo2[1]
		var R = 3959;
		var φ1 = toRadians(lat1);
		var φ2 = toRadians(lat2);
		var Δφ = toRadians(lat2-lat1));
		var Δλ = toRadians(lon2-lon1));

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
			console.log(tweet["geo"])
			return tweet["user"]["geo_enabled"] && tweet["geo"] != null
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