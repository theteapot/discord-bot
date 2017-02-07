module.exports = function main() {
    'use strict';

    const fs      = require('fs');
    const Clapp   = require('./modules/clapp-discord');
    const cfg     = require('../config.js');
    const pkg     = require('../package.json');
    const Discord = require('discord.js');
    const http    = require('http');
    const bot     = new Discord.Client();
    const rp      = require('request-promise');
    const spotifyWebApi = require('spotify-web-api-node');

    
	var spotifyApi = new spotifyWebApi({
        clientId: '17a15013264742a6aadbe4aef42a2653',
        clientSecret: 'e22d23a47e624185aceb1ac05aba9dfa',
        redirectUri: 'http://localhost:8888/callback'
    });

    /*
     * Authenticates spotifyApi object so spotify API requests 
     * are allowed
    */ 

    http.get('http://localhost:8888/code', (res) => {
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                let parsedData = JSON.parse(rawData);
                spotifyApi.setAccessToken(parsedData.accessToken);
                spotifyApi.setRefreshToken(parsedData.refreshToken); 
                id = parsedData.id;
                playlistPicker(id);
                console.log(`Got accessToken: ${parsedData.accessToken} \n Got refreshToken: ${parsedData.refreshToken} \n Got id: ${id} \n`);
                //searchTrack({track: 'Toxic', artist: ''});
            } catch (e) {
                console.log('Code GET error:', e.message);
            }
        })
    })
	
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
