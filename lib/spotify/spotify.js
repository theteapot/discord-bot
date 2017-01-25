var SpotifyWebApi = require('spotify-web-api-node');
var https = require('https');

var spotifyApi = new SpotifyWebApi({
    clientId: '17a15013264742a6aadbe4aef42a2653',
    clientSecret: 'e22d23a47e624185aceb1ac05aba9dfa',
    redirectUri: 'http://localhost:8888/callback'
});

var scopes = ['user-read-private', 'user-read-email', 'playlist-modify-private', 'playlist-modify-public'],
    redirectUri = 'https://example.com/callback',
    clientId = '5fe01282e44241328a84e7c5cc169165',
    state = 'some-state-of-my-choice';

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log(authorizeURL);

https.get(authorizeURL, (res) => {
    console.log(res.headers);
});

var code = 'AQDFrIJHtfS-hpNJZca8UKSXJENzrf328CTxHeFmOEGaLywYpCdeIiuwEmeCSDcKg15Jm8nFaR8vhchd--uM9meoXRYs9BIHmG6pUWcuy_vo3FQPXsVVvOWKmGXWCSs2jugyI2AhAT2oxm0WpCFgng_A59o0A65fTli_J9yYzEHsjeCbTMUXk-1s97gjEF7--PbWaoSyYMDVuIoutqOJMx-I6WyOw0Y8_q1rEWXxuxRcbKPSXbkgk2bMmgunXxOHCkvY2RdaYmaxjMH-djdkwiLwn-FgEfowCn27OWi5kxepqGgv3Mus288'

spotifyApi.authorizationCodeGrant(code)
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        console.log('The token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        console.log('The refresh token is ' + data.body['refresh_token']);
        spotifyApi.getMe()
          .then(function(data) {
            console.log('Some information about me', data.body);
            }, function(err) {
                console.log('Something went wrong!', err);
            });
        addTracks();
    }, function(err) {
        console.log('ERROR:', err);
    });

var addTracks = function() {
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
