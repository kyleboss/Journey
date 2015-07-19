var express = require('express');
var router = express.Router();
Tweet = require('../models/Tweet.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	Tweet.getTweets(0,0, function(tweets, pages) {
  		res.render('index', { tweets: JSON.stringify(tweets) });
  	});
});

router.get("/getTweetsFromDb",function(request, response){
    Tweet.getTweetsFromDb(function(tweets) {
        var formattedTweets = {timeBins: [{data: tweets, t: 1992}]};
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(formattedTweets));
        response.end();
    });
});

module.exports = router;
