var Clapp = require('../modules/clapp-discord');
var rp = require('request-promise');

module.exports = new Clapp.Command({
  name: "playlist",
  desc: "gets the name of a playlist",
  fn: (argv, context) => {
    // This output will be redirected to your app's onReply function 
  var response = ''
  var playlistPromise = rp(`http://localhost:9999/playlist/${argv.args.playlist}/${argv.args.user}`).then(function (jsonString) {
       response = jsonString;
       console.log('JSONed playlist: ', response);
   });
  return new Promise(function(resolve, reject) {
    playlistPromise.then(() => {
        resolve(response);
       }, () => {
        reject(response);
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
