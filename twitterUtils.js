module.exports = function(T) {
	var twitter = {}
	twitter.getPreviousTweet = function(tweet) {
		T.get('statuses/user_timeline', { user_id: tweet["user"]["id"], count: 2 }, function(err, data, response) {
	  		console.log(data)
		})
	}
	return twitter
}