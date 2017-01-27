var Clapp = require('../modules/clapp-discord');
var request = require('request');
var rp = require('request-promise');


module.exports = new Clapp.Command({
    name: 'search',
    desc: 'displays results of query',
    fn: (argv, context) => { 
        function test() {
            var x = 1;
        }
        
        var response = ''

        var x = rp(`http://localhost:9999/search/${argv.args.track}/${argv.args.artist}`).then(function (htmlString) {
            response = JSON.parse(htmlString);
            console.log('JSONed response: ', response)
            formattedResponse = `Track: ${argv.args.track} Artist:${argv.args.artist}\n`;
            for (var track in response) {
                var name = response[0].name.substring(0,30);
                var artists = response[0].artists.substring(0,30);
                var uri = response[0].uri;
                formattedResponse += `\n|  ${name}  |  ${artists}  |  ${uri}  |\n`
            }
            response = formattedResponse;
            console.log(response);
        })
        return new Promise(function(resolve, reject) {
                x.then(() => {
                    resolve(response);
                })
            })
        
            /*request(`http://localhost:9999/search/${argv.args.track}/${argv.args.artist}`, function (err, res, body) {
                if (!err && res.statusCode === 200) {
                    response = body;
                    resolve(response);
                }
            })*/

    },
    args: [
        {
            name: 'track',
            desc: 'the name of the track to search',
            type: 'string',
            default: 'default'
        },
        {
            name: 'artist',
            desc: 'the name of the artist to search',
            type: 'string',
            default: 'default'
        }
    ], 
    flags: [
        {
            name: 'ugly',
            desc: 'Shows a unprettified array',
            type: 'boolean',
            alias: 'u',
            default: false
        }
    ]
});
