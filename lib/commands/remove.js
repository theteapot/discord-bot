var Clapp = require('../modules/clapp-discord');
var rp = require('request-promise');

module.exports = new Clapp.Command({
  name: "remove",
  desc: "Remove all occurances of tracks with given uri",
  fn: (argv, context) => {
    // This output will be redirected to your app's onReply function 
      var response = '';
      var addPromise = rp(`http://localhost:9999/remove/${argv.args.user}/${argv.args.playlist}/${argv.args.uri}`).then(function () {
          response = 'removed track ', argv.args.uri;
      });

      return new Promise(function (resolve, reject) {
        addPromise.then(() => {
            resolve(response)
        })
      })
  },
  args: [ 
    {
      name: 'uri',
      desc: 'The uri of one track remove',
      type: 'string',
      required: true
    },
    {
      name: 'user',
      desc: 'the name of the playlist owner, e.g. whistlingteapot',
      type: 'string',
      required: false,
      default: 'whistlingteapot'
    },
    {
      name: 'playlist',
      desc: 'The id of the playlist to remove the track from',
      type: 'string',
      required: false,
      default: '6ekP7XeoMqvAeOu4ZRxbIq'
    }
  ],
  flags: [
    {
      name: 'next',
      desc: 'Adds the track as the next on the playlist',
      alias: 'n',
      type: 'boolean',
      default: false
    }
  ]
});
