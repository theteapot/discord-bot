var Clapp = require('../modules/clapp-discord');
var rp = require('request-promise');

module.exports = new Clapp.Command({
  name: "playlist",
  desc: "gets the name of a playlist",
  fn: (argv, context) => {
    // This output will be redirected to your app's onReply function 
  var response = ''
  var playlistPromise = rp(`http://localhost:9999/playlist/${argv.args.playlist}/${argv.args.user}`).then(function (playlistJSON) {
      console.log(`Getting playlist ${argv.args.playlist} : ${argv.args.user}`)
      playlist = JSON.parse(playlistJSON);
      formattedResponse = ''
      for (var index in playlist.body.tracks.items) {
          var trackObj = playlist.body.tracks.items[index];
          var uri = trackObj.track.uri;
          var name = trackObj.track.name.substring(0,20);
          var artist = trackObj.track.artists[0].name.substring(0,20);
          formattedResponse += `[${index}] ${name} : ${artist} : ${uri}\n`
      }
      response = formattedResponse;
   });

  return new Promise(function(resolve, reject) {
    playlistPromise.then(() => {
        resolve(response);
       });
   })
  },
  args: [
    {
      name: 'playlist',
      desc: 'The id of the playlist to get, e.g. 6ekP7XeoMqvAeOu4ZRxbIq',
      type: 'string',
      required: false,
      default: '6ekP7XeoMqvAeOu4ZRxbIq'
    }, 
    {
      name: 'user',
      desc: 'The name of the user, e.g. whistlingteapot',
      type: 'string',
      required: false,
      default: 'whistlingteapot'
    }
  ],
  flags: [
    {
      name: 'testflag',
      desc: 'A test flag',
      alias: 't',
      type: 'boolean',
      default: false
    }
  ]
});
