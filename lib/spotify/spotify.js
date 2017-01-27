var SpotifyWebApi = require('spotify-web-api-node');
var http = require('http');
var express = require('express');

var spotifyApi = new SpotifyWebApi({
    clientId: '17a15013264742a6aadbe4aef42a2653',
    clientSecret: 'e22d23a47e624185aceb1ac05aba9dfa',
    redirectUri: 'http://localhost:8888/callback'
});

/*
 * Authenticates spotifyApi object so spotify API requests are allowed
 */ 

http.get('http://localhost:8888/code', (res) => {
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
        try {
            let parsedData = JSON.parse(rawData);
            //console.log(parsedData.code, parsedData.accessToken, parsedData.refreshToken, 'Authorizing...');
            spotifyApi.setAccessToken(parsedData.accessToken);
            spotifyApi.setRefreshToken(parsedData.refreshToken); 
            console.log('Got authorization tokens');
            //searchTrack({track: 'Toxic', artist: ''});
        } catch (e) {
            console.log('Code GET error:', e.message);
        }
    })
})

/*
 * Spotify API listening server (should deprecate in favour of passing spotifyApi object in clapp context
 * 
 */ 

var app = express();

app.get('/search/:track/:artist', function (req, res) {
    var query = req.params;
    console.log('Got query request', req.params);
    searchTrack(query, function (queryResults) {
        res.send(queryResults);
    });    
    
})

console.log('listening on 9999')
app.listen(9999);

/*
 * Spotify API functions
 *
 */ 

function searchTrack(query, callback) {
    console.log(query.track, query.artist);
    var searchPromise;
    if (query.track != 'no-track' && !query.artist != 'no-artist') {
        //search track only
        searchPromise = spotifyApi.searchTracks(`track:${query.track}`, {limit:3})
    } else if (query.track != 'no-track' && !query.artist != 'no-artist') {
        //search artist only
        searchPromise = spotifyApi.searchTracks(`artist:${query.artist}`, {limit:3})
    } else if (query.track != 'no-track' && !query.artist != 'no-artist') {
        //search track and artist
        searchPromise = spotifyApi.searchTracks(`track:${query.track} artist:${query.artist}`, {limit:3})
    }
    searchPromise.then(function(data) {
        console.log(`Results for track: ${query.track} artist:${query.artist}`, data.body);
        var queryResults = [];
        for (var track in data.body.tracks.items) {
            var trackName = data.body.tracks.items[track].name;
            var trackArtists = ''
            var trackUri = data.body.tracks.items[track].uri
            for (var artist in data.body.tracks.items[track].artists) {
                trackArtists += data.body.tracks.items[track].artists[artist].name + ', '
            }
            queryResults.push({name : trackName, artists : trackArtists, uri : trackUri})
            //console.log(trackName, ' : ', trackArtists, ' : ', trackUri)
        }
        console.log(queryResults);
        callback(queryResults)
    }, function(err) {
        console.log('Search error', err)
    })
}


function addTracks () {
    spotifyApi.addTracksToPlaylist('whistlingteapot', '6ekP7XeoMqvAeOu4ZRxbIq', ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]).then(function(data) {
        console.log('added tracks');
    }, function(err) {
        console.log('Unable to add tracks: ', err)
    });
}


/*console.log(
    spotifyApi.searchArtists('love')
    .then(function (data) {
        console.log('Artists by love', data.body);
    }, function (err) {
        console.log(err);
    })
);*/
