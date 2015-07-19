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
    console.log("in here too")
    Tweet.getTweetsFromDb(function(tweets) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(tweets));
    });
});

module.exports = router;
