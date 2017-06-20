
const { app, BrowserWindow, Tray } = require('electron');
const path = require('path');
const Positioner = require('electron-positioner');

let window = null,
	tray = null,
	getStatusBarIcon = () => path.join(__dirname, './assets/icon-darkmode.png');


let showWindow = (trayBounds) => {
	if (window == null) createWindow();

	const positioner = new Positioner(window);
	const position = positioner.calculate('trayCenter', trayBounds);
	window.setPosition(position.x, position.y + 2, false);
	window.show();
	window.focus();
};

let createWindow = () => {
	window = new BrowserWindow({
		width: 250,
		height: 520,
		show: false,
		frame: false,
		fullscreenable: false,
		resizable: false,
		transparent: true
	});
	window.on('closed', () => window = null);
	window.on('blur', () => window.hide());
	window.loadURL('file://'+path.join(__dirname, 'index.html'));
};

module.exports = {
	hidden: true,

	showTray: () => {
		if (tray == null) {
			tray = new Tray(getStatusBarIcon());
			tray.on('click', (event, trayBounds) => showWindow(trayBounds));
			this.hidden = false;
		}
	},

	hideTray: () => {
		if (tray) {
			tray.destroy();
			tray = null;
			this.hidden = true;
		}

		if (window) {
			window.close();
		}
	}

};
