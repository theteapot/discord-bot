var Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Command({
    name: 'enque',
    desc: 'adds strings to a queue',
    fn: (argv, context) => {
        return 'Enque executed Song name:' + argv.args.songTitle +  (argv.flags.displayQueue ? 'displayQueue was passed' : '')
        },
    args: [
        {
            name: 'songTitle',
            desc: 'Search string for a song (e.g. the title)',
            type: 'string',
            required: true,
            default: 'null'
        }
    ], 
    flags: [
        {
            name: 'displayQueue',
            desc: 'Displays all songs in queue after adding',
            type: 'boolean',
            alias: 'd',
            default: false
        }
    ]
});



