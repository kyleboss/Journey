var express = require('express');
var router = express.Router();
Tweet = require('../models/Tweet.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	Tweet.getTweets(0,0, function(tweets, pages) {
  		res.render('index', { tweets: JSON.stringify(tweets) });
  	});
});

module.exports = router;
