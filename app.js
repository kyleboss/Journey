var http = require('http');
var express = require('express');
var app = express();
//...
var Twit = require('twit');
var T = new Twit({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
});

var server = http.createServer(app).listen(
  app.get('port'), function() {
    console.log('Express server listening on port ' + 
    app.get('port'));
});

var io = require('socket.io').listen(server);
var stream = T.stream('statuses/sample')

io.sockets.on('connection', function (socket) {
  stream.on('tweet', function(tweet) {
    socket.emit('info', { tweet: tweet});
  });
});