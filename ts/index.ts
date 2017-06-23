let { remote, ipcRenderer } = require('electron');
let fs = require('fs'),
	path = require('path'),
	browserWindow = remote.getCurrentWindow(),
	configDirectory = path.join(process.env.HOME, '.dione/config');

let player = require('./player').init();
let podcastSeachGui = require('./podcast-search-gui').init();
