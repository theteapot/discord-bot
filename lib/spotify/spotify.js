var SpotifyWebApi = require('spotify-web-api-node');
var http = require('http');
var express = require('express');

var spotifyApi = new SpotifyWebApi({
    clientId: '17a15013264742a6aadbe4aef42a2653',
    clientSecret: 'e22d23a47e624185aceb1ac05aba9dfa',
    redirectUri: 'http://localhost:8888/callback'
});


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
            playlistTracker('whistlingteapot', '6ekP7XeoMqvAeOu4ZRxbIq');
            //searchTrack({track: 'Toxic', artist: ''});
        } catch (e) {
            console.log('Code GET error:', e.message);
        }
    })
})

/*
 * Keeps track of what song is playing, assuming tracks are 
 * played contiguously and not paused
*/

var trackerObj = {
    initialTime: new Date().getTime(),
    totalTime: 0,
    tracks: []
};

function playlistTracker (user, playlistId) {
    console.log('building playlist object');
    spotifyApi.getPlaylist(user, playlistId).then(function(data) {
        //Create object with info about playlists tracks
        var totalDuration = 0;
        for (var index in data.body.tracks.items) {
            var trackObj = data.body.tracks.items[index];
            var name = trackObj.track.name;
            var start = totalDuration;
            var finish = totalDuration += trackObj.track.duration_ms;           
            var artist = trackObj.track.artists[0].name;
            trackerObj.tracks.push({name: name, start: start, finish: finish, artist: artist});
        }
        trackerObj.totalTime = totalDuration;
        console.log('done building playlist object');
        //console.log(trackerObj, totalDuration);
    }, function(err) {
        console.log('there was an error', err);
    });
}


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
        console.log(playlist.body.tracks.items);
        res.send(playlist);
    });
});

app.get('/playing', function (req, res) {
    var currTime = (new Date().getTime() - trackerObj.initialTime) % trackerObj.totalTime; //Time elapsed since start, put into playlist length.
    console.log('Elapsed time:', currTime/1000, 'seconds');
    for (var index in trackerObj.tracks) {
        revIndex = trackerObj.tracks.length - 1 - index; //index counts from high to low to get playing tracks
        if (currTime > trackerObj.tracks[revIndex].start) {
            console.log('Currently playing:', trackerObj.tracks[revIndex].name);
            res.send({
                name: trackerObj.tracks[revIndex].name,
                position: revIndex,
                start: trackerObj.tracks[revIndex].start,
                finish: trackerObj.tracks[revIndex].finish
            })
            return;
        }
    }
});

app.get('/remove/:user/:playlist/:uri', function (req, res) {
    var params = req.params;
    console.log('Got remove track request', params);
    removeTrack(params.user, params.playlist, [{uri:params.uri}], function (response) {
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
        callback(data)
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
