const {
    app, Tray, BrowserWindow, dialog
} = require('electron')

let window = null, tray = null

const isSecondInstance = app.makeSingleInstance((argv, cwd) => showWindow())
if (isSecondInstance) {
	console.error('this is a second instance')
	app.exit(0)
}

app.on('ready', () => {

    tray = new Tray(`${__dirname}/assets/icon-darkmode.png`)
    tray.setToolTip(app.getName())
    tray.on('click', () => {
        if (window && window.isFocused())
            window.minimize()
        else
            showWindow()
    })

    showWindow()
})

const showWindow = () => {
    if (window == null) {
        window = new BrowserWindow({
            width: 350,
            height: 700,
            title: app.getName(),
    		autoHideMenuBar: true,
    		icon: `${__dirname}/assets/icon.png`,
        })

        window.on('closed', () => window = null)
        window.loadURL(`file://${__dirname}/index.html`)

        let closeWindow = false
        window.on('close', function onclose(event){
            if (closeWindow) {
                console.error('this shit should not happen')
                app.exit(1)
                return
            }

            event.preventDefault()
            window.show()
            window.focus()
            dialog.showMessageBox(window, {
                type: 'info',
    			buttons: ['Cancel', 'Hide', 'Close Window', 'Quit'],
                cancelId: 0,
    			defaultId: 1,
    			message: 'Do you really want to close this window?'
            }, (btnId) => {
                if (btnId == 1) {
                    window.hide()
                } else if (btnId == 2) {
                    closeWindow = true
                    window.removeListener('close', onclose)
                    window.close()
                } else if (btnId == 3) {
                    closeWindow = true
                    window.removeListener('close', onclose)
                    window.close()
                    app.quit()
                }
            })

            return false
        })

        if (process.argv.indexOf('--dev') > 0) {
            window.on('show', () => window.webContents.openDevTools({ mode: 'undocked' }))
        } else {
            window.on('blur', () => window.hide())
        }

    } else {
        window.show()
        window.focus()
    }
}
