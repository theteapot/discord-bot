var Clapp = require('../modules/clapp-discord');

module.exports = new Clapp.Command({
    name: 'view',
    desc: 'shows the current song queue',
    fn: (argv, context) => {
        var queue = context.queue;
        var outString = '';
        var counter = 1;
        console.log('view queue: '+queue);
        for (var title in queue) {
            outString += counter + ' : ' + queue[title] + '\n';
            counter++;
        }
        return outString
    },
    args: [
        {
            name: 'placeholder',
            desc: 'is not used',
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



