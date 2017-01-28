var SpotifyWebApi = require('spotify-web-api-node');
var http = require('http');
var express = require('express');

var spotifyApi = new SpotifyWebApi({
    clientId: '17a15013264742a6aadbe4aef42a2653',
    clientSecret: 'e22d23a47e624185aceb1ac05aba9dfa',
    redirectUri: 'http://localhost:8888/callback'
});

/*
 * Keeps track of what song is playing, assuming tracks are 
 * played contiguously and not paused
*/



/*
 * Authenticates spotifyApi object so spotify API requests 
 * are allowed
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
 * Spotify API listening server (should deprecate in favour 
 * of passing spotifyApi object in clapp context
*/ 

var app = express();

app.get('/search/:track/:artist', function (req, res) {
    var query = req.params;
    console.log('Got query request', req.params);
    searchTrack(query, function (queryResults) {
        res.send(queryResults);
    });        
})

app.get('/add/:trackUri', function (req, res) {
    var params = req.params;
    console.log('Got add request', params);
    res.send(addTrack(params.trackUri));
});

app.get('/playlist/:playlist/:user', function (req, res) {
    var params = req.params;
    console.log('Got playlist request', params);
    getPlaylist(params.playlist, params.user, function (playlist) {
        console.log(playlist);
        res.send(playlist);
    });
});

app.get('/remove/:user/:playlist/:uri', function (req, res) {
    var params = req.params;
    console.log('Got remove track request', params);
    removeTrack(params.user, params.playlist, [{uri:params.uri}], function (response) {
        console.log(response);
        res.send(response);
    });
});

console.log('listening on 9999')
app.listen(9999);

/*
 * Spotify API functions
 */ 

function searchTrack(query, callback) {
    console.log(query.track, query.artist);
    var searchPromise;
    if (query.track !== 'no-track' && !query.artist !== 'no-artist') {
        //search track only
        searchPromise = spotifyApi.searchTracks(`track:${query.track}`, {limit:3})
    } else if (query.track === 'no-track' && query.artist != 'no-artist') {
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

function addTrack (uri) {
    spotifyApi.addTracksToPlaylist('whistlingteapot', '6ekP7XeoMqvAeOu4ZRxbIq', uri).then(function(data) {
        return 'added tracks';
    }, function(err) {
        return 'Unable to add tracks: ' +  err
    });
}

function getPlaylist (playlist, user, callback) {
    spotifyApi.getPlaylist(user, playlist).then(function(data) {
        responseString = '';
        for (var index in data.body.tracks.items) {
            var track = data.body.tracks.items[index].track.name.slice(0,20);
            var artist = data.body.tracks.items[index].track.artists[0].name.slice(0,20);
            var uri = data.body.tracks.items[index].track.uri
            responseString += `[${index}] ${track} : ${artist} : ${uri} \n`;
        }
        callback('Retrieved playlist ' + responseString)
    }, function (err) {
        console.log('Couldn\'t get playlist ' + err);
        callback( 'Couldn\'t get playlist ' + err);
    });
}

function removeTrack(user, playlist, tracks, callback) {
   spotifyApi.removeTracksFromPlaylist(user, playlist, tracks)
     .then(function(data) {
         console.log('Tracks removed');
         callback('Tracks removed');
     }, function(err) {
         console.log('Error removing tracks', err);
         callback('Error removing tracks', err);
     });
}
