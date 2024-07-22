const fs = require('fs')
const path = require('path')

// -----------------------------------------------------------
//
// attention: if you add dependencies here, you might have to edit
// forge.config.js, , the part about:
// '^\\/node_modules/(?!dotenv)$',
//
// if you have an idea  to do that automatically, let me know
const dotenv = require('dotenv')
//
// -----------------------------------------------------------

dotenv.config()

try {
  if (fs.existsSync(".env.local")) {
    const result = dotenv.config({ path: ".env.local" })
    console.log("using .env.local")
    process.env = {
      ...process.env,
      ...result.parsed,
    }
  }
} catch (err) {
  // do nothing
  console.log("using .env")
}

const { app, BrowserWindow, screen } = require('electron')


try {
  // used when the app is built with `npm run electron:make`
  require(path.join(process.resourcesPath, 'standalone/server.js'))
} catch (err) {
  // used when the app is started with `npm run electron:start`
  require(path.join(process.cwd(), '.next/standalone/server.js'))
}

// TODO: load the proxy server (for AI providers that refuse browser-side clients)
// const proxyServerPath = path.join(currentDir, '.next/standalone/proxy-server.js')
// require(proxyServerPath)

const createWindow = () => {
  const mainScreen = screen.getPrimaryDisplay()
  const allScreens = screen.getAllDisplays()
  console.log("debug:", {
    mainScreen,
    allScreens
  })

  const mainWindow = new BrowserWindow({
    // copy the width and height
    ...mainScreen.workAreaSize,

    icon: './public/logos/clapper.png'
  })

  mainWindow.loadURL('http://0.0.0.0:3000/')

  mainWindow.on('closed', () => {
    app.quit()
  })
}

app.whenReady().then(() => {

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})