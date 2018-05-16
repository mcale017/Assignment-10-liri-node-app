require("dotenv").config();

var keys = require("./keys.js");

var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var action = process.argv[2];
// var parameter = everything after process.argv[2]

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
    // still need to change it so that query is whatever I type in, not something that's already there
    // also if query is empty, then default to so and so
    spotify.search( {type: 'track', query: 'we like 2 party big bang', limit: 1}, function(error, response) {
        if (!error) {
            console.log(response.tracks.items[0].artists[0].name);
            console.log(response.tracks.items[0].name);
            console.log(response.tracks.items[0].preview_url);
            console.log(response.tracks.items[0].album.name);
        } else {
            console.log(error);
        }
    })
}

else if (action === "movie-this") {

}

else if (action === "do-what-it-says") {

}