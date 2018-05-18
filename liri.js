// Where the API keys are stored
require("dotenv").config();

// Requiring the keys for Twitter & Spotify APIs from keys.js which gets them from .env
var keys = require("./keys.js");

// Enabling file system
var fs = require("fs");

// Enabling the 3 npm's
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

// Constructor for each Spotify & Twitter objects (keys as their properties)
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

// First parameter after 'node' and 'liri.js', we will use this parameter as the app's action
var action = process.argv[2];

// Second parameter that will be used as a song input for 'spotify-this-song' or as a movie input for 'movie-this'
var variable = JSON.stringify(process.argv.slice(3));

switch(action) {
    case "my-tweets":
        tweet();
        break;
    
    case "spotify-this-song":
        song();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        liri();
        break;
}

function tweet() {
    twitter.get('statuses/user_timeline', {screen_name: 'mcale017', count: 20}, function(error, tweets, response) {
        if (!error) {
            // First line that will get logged into log.txt when this function is run. It's not in the for loop because it's only needed at the top
            fs.appendFile('log.txt', "=============== Twitter Log for " + Date() + " ===============\n", function(error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Tweets have been logged into log.txt.");
                }
            })

            // making i < tweets.length takes care of any problems if there are less than 20 tweets from that user
            for (var i = 0; i < tweets.length; i++) {
                // This will loop over every tweet and console log each tweet and its date
                console.log("Tweet: " + tweets[i].text
                        + "\nDate: " + tweets[i].created_at + "\n");
                // This will instead of console logging, append them to the log.txt file
                fs.appendFile('log.txt', "Tweet: " + tweets[i].text + "\nDate: " + tweets[i].created_at + "\n", function(error) {
                    if (error) {
                        console.log(error);
                    }
                })
            }
        } else {
            console.log(error);
        }
    })
}

function song(value) {
    // If song() is called without a parameter, it'll default to variable which is typed in as a command
    if (value == null) {
        value = variable;
    }
    spotify.search( {type: 'track', query: value, limit: 1}, function(error, response) {
        if (!error) {
            console.log("Artist(s): " + response.tracks.items[0].artists[0].name
                    + "\nSong: " + response.tracks.items[0].name
                    + "\nPreview Link: " + response.tracks.items[0].preview_url
                    + "\nAlbum: " + response.tracks.items[0].album.name);
        } else {
            console.log(error);
        }
    })
}

function movie(value) {
    // If movie() is called without a parameter, it'll default to variable which is typed in as a command
    if (value == null) {
        value = variable;
    }
    request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title
                   + "\nYear: " + JSON.parse(body).Year
                   + "\nIMDB Rating: " + JSON.parse(body).imdbRating
                   + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
                   + "\nCountry: " + JSON.parse(body).Country
                   + "\nLanguage: " + JSON.parse(body).Language
                   + "\nPlot: " + JSON.parse(body).Plot
                   + "\nActors: " + JSON.parse(body).Actors + "\n");
        }
    })  
}

function liri() {
    // From the random.txt file
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error);
        } else {
            // Splitting the 2 strings separated by a comma
            var randomAction = data.toString().split(", ")[0];
            // This will include everything that was inside of ""
            var randomVariable = data.toString().split(", ")[1];

            // If randomAction is my-tweets, run the tweet() function
            if (randomAction === "my-tweets") {
                tweet();
            }
            // randomVariable will be the given parameter for function song()
            else if (randomAction === "spotify-this-song") {
                song(randomVariable);
            }
            // randomVariable will be the given parameter for function movie()
            else if (randomAction === "movie-this") {
                movie(randomVariable);
            }
        }
    })
}