module.exports = function(T) {
	var twitter = {}
	twitter.getPreviousTweet = function(tweet) {
		T.get('statuses/user_timeline', { user_id: tweet["user"]["id"], count: 2 }, function(err, data, response) {
	  		console.log(data[0]["text"] + "\n" + data[1]["text"])
	  		console.log("\n\n\n\n")
		})
	}
	return twitter
}