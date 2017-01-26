var SpotifyWebApi = require('spotify-web-api-node');
var http = require('http');
var express = require('express');

var spotifyApi = new SpotifyWebApi({
    clientId: '17a15013264742a6aadbe4aef42a2653',
    clientSecret: 'e22d23a47e624185aceb1ac05aba9dfa',
    redirectUri: 'http://localhost:8888/callback'
});

http.get('http://localhost:8888/code', (res) => {
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
        try {
            let parsedData = JSON.parse(rawData);
            //console.log(parsedData.code, parsedData.accessToken, parsedData.refreshToken, 'Authorizing...');
            spotifyApi.setAccessToken(parsedData.accessToken);
            spotifyApi.setRefreshToken(parsedData.refreshToken); 
            //searchTrack({track: 'Toxic', artist: ''});
        } catch (e) {
            console.log('Code GET error:', e.message);
        }
    })
})

var app = express();

app.get('/search/:track/:artist', function (req, res) {
    var search = req.params;
    
})

console.log('listening on 9999')
app.listen(9999);

function searchTrack(query) {
    spotifyApi.searchTracks(`track:${query.track} artist:${query.artist}`)
    .then(function(data) {
        console.log(`Results for track: ${query.track} artist:${query.artist}`, data.body);
        var queryResults = {};
        for (var track in data.body.tracks.items) {
            var trackName = data.body.tracks.items[track].name;
            var trackArtists = ''
            var trackUri = data.body.tracks.items[track].uri
            for (var artist in data.body.tracks.items[track].artists) {
                trackArtists += data.body.tracks.items[track].artists[artist].name + ', '
            }
            returnObj.push({name : trackName, artists : trackArtists, uri : trackUri})
            console.log(trackName, ' : ', trackArtists, ' : ', trackUri)
        }
        return queryResults
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
