# discord-mubot [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> listens to chat, maybe plays music?

## Installation

Clone this repository, and run:
```sh
$ npm install
```

## Usage

## Setting up PulseAudio
A quick step-by-step guide for setting up discord to use system audio as a recording device. 

1. Find the name of the audio source monitor in PulseAudio.
```sh
$ pacmd list-sources | grep -e device.string -e 'name:'
e.g. alsa_output.pci-0000_00_1b.0.analog-stereo.monitor
```
N.B. Every 'source' has a monitor, choose the monitor rather than the source.

2. Add the monitor to your `/etc/asound.conf` or `~/.asoundrc` files by adding the following (using `alsa_output.pci-0000_00_1b.0.analog-stereo.monitor` as an example):
```conf
pcm.pulse_monitor {
  type pulse
  device alsa_output.pci-0000_00_1b.0.analog-stereo.monitor
}

ctl.pulse_monitor {
  type pulse
  device alsa_output.pci-0000_00_1b.0.analog-stereo.monitor
}
```

Now you can select it as a recording source in PulseAudio (you may need to relog or restart PulseAudio to see it).

3. Open PulseAudio GUI and go to the 'Recording' tab, you should see one application (WEBRTC VoiceEngine - discord), choose 'Monitor of ...' in the 'from' field. You should not have to change any settings in the discord application (i.e. leave input and output devices as 'default'). 

4. Done! Enjoy.

```js
$ npm run bot
```
## License

MIT © [Taylor Kettle]()


[npm-image]: https://badge.fury.io/js/discord-mubot.svg
[npm-url]: https://npmjs.org/package/discord-mubot
[travis-image]: https://travis-ci.org//discord-mubot.svg?branch=master
[travis-url]: https://travis-ci.org//discord-mubot
[daviddm-image]: https://david-dm.org//discord-mubot.svg?theme=shields.io
[daviddm-url]: https://david-dm.org//discord-mubot
