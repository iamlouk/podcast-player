const { app } = require('electron');
app.on('ready', () => {
	require('./podcastmain.js').showTray();
});
