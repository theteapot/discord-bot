var Clapp = require('../modules/clapp-discord');
var rp = require('request-promise');

module.exports = new Clapp.Command({
  name: "add",
  desc: "adds track uri's to playlist",
  fn: (argv, context) => {
    // This output will be redirected to your app's onReply function 
      var response = '';
      var addPromise = rp(`http://localhost:9999/add/${argv.args.uri}`).then(function () {
          response = 'added track ', argv.args.uri;
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
      desc: 'The uri of one track to add',
      type: 'string',
      required: true
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
