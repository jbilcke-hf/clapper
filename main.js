const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

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

const currentDir = process.cwd()

const mainServerPath = path.join(currentDir, '.next/standalone/server.js')

// now we load the main server
require(mainServerPath)

const voiceServerPath = path.join(currentDir, '.next/standalone/voice-server.js')

// now we load the voice server
require(voiceServerPath)


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

    icon: './public/icon.png'
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