/** @jsx React.DOM */
console.log("GRR")
var Tweet = React.createClass({
    render: function() {
        return (
            <li>{this.props.text}</li>
        )
    }
});

var TweetList = React.createClass({
    render: function() {
        var tweets = this.props.data.map(function(tweet) {
            return <Tweet text={tweet.text} />;
        });
        return (
            <div>
                <ul>
                    {tweets}
                </ul>
            </div>
        )
    }
});

var TweetBox = React.createClass({
    addTweet: function(tweet) {
        var tweets = this.state.data;
        var newTweets = tweets.concat([tweet]);

        console.log(newTweets)
        if(newTweets.length > 15) {
            newTweets.splice(0, 1);
        }
        this.setState({data: newTweets});
    },
    getInitialState: function() {
        return {data: []};
    },
    componentWillMount: function() {
        var socket = io.connect("http://justlanded.herokuapp.com:8080");
        var self = this;

        // socket.on('info', function (data) {
        //     self.addTweet(data.tweet);
        // });

        var host = location.origin.replace(/^http/, 'ws')
        var ws = new WebSocket(host);
        ws.onmessage = function (data) {
            self.addTweet(data.tweet);
        }

    },
    render: function() {
        return (
            <div>
                <h1>Hello</h1>
                <TweetList data={this.state.data} />
            </div>
        )
    }
});

React.render(
  <TweetBox />,
  document.getElementById('content')
);