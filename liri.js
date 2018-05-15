require("dotenv").config();

var keys = require("./keys.js");

var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var action = process.argv[2];

if (action === "my-tweets") {
    twitter.get('statuses/user_timeline', {screen_name: 'mcale017', count: 20}, function(error, tweets, response) {
        if (!error) {
            // only goes up to 10 for now, I only have 10 tweets
            for (var i = 0; i < 10; i++) {
            console.log(tweets[i].text + "\n");
            }
        } else {
            console.log(error);
        }
    })
}

else if (action === "spotify-this-song") {

}

else if (action === "movie-this") {

}

else if (action === "do-what-it-says") {

}