module.exports = function main() {
    'use strict';

    const fs      = require('fs');
    const Clapp   = require('./modules/clapp-discord');
    const cfg     = require('../config.js');
    const pkg     = require('../package.json');
    const Discord = require('discord.js');
    const bot     = new Discord.Client();
    const rp      = require('request-promise');

    var app = new Clapp.App({
      name: cfg.name,
      desc: pkg.description,
      prefix: cfg.prefix,
      version: pkg.version,
      onReply: (msg, context) => {
        // Fired when input is needed to be shown to the user.
        context.msg.reply('\n' + msg).then(bot_response => {
          if (cfg.deleteAfterReply.enabled) {
            context.msg.delete(cfg.deleteAfterReply.time)
              .then(msg => console.log(`Deleted message from ${msg.author}`))
              .catch(console.log);
            bot_response.delete(cfg.deleteAfterReply.time)
              .then(msg => console.log(`Deleted message from ${msg.author}`))
              .catch(console.log);
          }
        });
      }
    });

    // Load every command in the commands folder
    fs.readdirSync('./lib/commands/').forEach(file => {
      if (file[0] !== '.') {
          app.addCommand(require("./commands/" + file));
      }
    });

    bot.on('message', msg => {
      // Fired when someone sends a message
      if (app.isCliSentence(msg.content)) {
        app.parseInput(msg.content, {
          msg: msg,
          // Keep adding properties to the context as you need them
        });
      //console.log('myQueue in message handler ' + myQueue)
      }
    });

    bot.login(cfg.token).then(() => {
      console.log('Running!');
    });
}
