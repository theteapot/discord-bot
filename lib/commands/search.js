var Clapp = require('../modules/clapp-discord');
var request = require('request');
var rp = require('request-promise');


module.exports = new Clapp.Command({
    name: 'search',
    desc: 'displays results of query',
    fn: (argv, context) => { 
                
        var response = ''

        var responsePromise = rp(`http://localhost:9999/search/${argv.flags.trackFlag}/${argv.flags.artistFlag}`).then(function (jsonString) {
            response = JSON.parse(jsonString);
            console.log('JSONed response: ', response)
            formattedResponse = `Track: ${argv.flags.trackFlag} Artist:${argv.flags.artistFlag}\n`;
            for (var track in response) {
                var name = response[0].name.substring(0,30);
                var artists = response[0].artists.substring(0,30);
                var uri = response[0].uri;
                formattedResponse += `\n|  ${name}  |  ${artists}  |  ${uri}  |\n`
            }
            response = formattedResponse;
        })
        return new Promise(function(resolve, reject) {
                responsePromise.then(() => {
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
            default: 'no-track'
        },
        {
            name: 'artist',
            desc: 'the name of the artist to search',
            type: 'string',
            default: 'no-artist'
        }
    ], 
    flags: [
        {
            name: 'trackFlag',
            desc: 'Takes the value of the track to search, e.g. -t "telegraph road"',
            type: 'string',
            alias: 't',
            default: 'no-track'
        },
        {
            name: 'artistFlag',
            desc: 'Takes the value of the artist to search, e.g. -a "green day"',
            type: 'string',
            alias: 'a',
            default: 'no-artist'
        }
    ]
});
