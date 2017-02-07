'use strict';

var assert = require('assert');
var myDiscordBot = require('../lib');
var spotify = require('../lib/spotify/spotify.js')

describe("hooks", function() {
	before(function() {
		spotify.main()
	})
})

console.info(myDiscordBot)

describe('myDiscordBot', function () {
  it('should have unit test!', function () {
    assert(false, 'we expected this package author to add actual unit tests.');
  });
});

