var Clapp = require('../modules/clapp-discord');
var rp = require('request-promise');

module.exports = new Clapp.Command({
  name: "playing",
  desc: "gives the name of the currently playing track",
  fn: (argv, context) => {
    // This output will be redirected to your app's onReply function 
      var response = '';
      var addPromise = rp('http://localhost:9999/playing').then(function (data) {
          //'Draws' a bar to represent the tracks progress
          //uses 20 dashes for the entire bar
          data = JSON.parse(data);
          var dashValue = (data.finish - data.start) / 20;
          var elapsedTime = data.elapsedTime - data.start;
          
          //Function for turning the duration of the track from ms to mm:ss
          function msConverter(milliseconds) {
            var minutes = Math.floor(milliseconds / 60000);
            var seconds = Math.floor(milliseconds / 1000) - (minutes * 60);
            return minutes + ':' + seconds
          }
          
          var endTime = msConverter(data.finish - data.start);
          var currTime = msConverter(data.elapsedTime - data.start);

          var barString = '';
          var counter = 0
          while ( counter < elapsedTime) {
            //console.log(counter, elapsedTime, barString);
            counter += dashValue
            barString += '-';
          }
          barString += '|';
          barString = (barString + '--------------------' ).slice(0, 20);
          response = `${data.name} \n ${currTime} ${barString} ${endTime}`;
          console.log('Playing response recieved:', response)
      });

      return new Promise(function (resolve, reject) {
        addPromise.then(() => {
            resolve(response)
        })
      })
  },
  args: [ 
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
