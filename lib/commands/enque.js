var Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Command({
    name: 'enque',
    desc: 'adds strings to a queue',
    fn: (argv, context) => {
        context.queue.push(argv.args.songTitle);
        return argv.args.songTitle;
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
            name: 'placeHolder',
            desc: 'noFlagYet',
            type: 'boolean',
            default: false
        }
    ]
});



