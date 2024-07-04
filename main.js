const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const { spawn } = require("node:child_process")
const { writeFileSync } = require("node:fs")

const path = require("node:path")
const convert = require('xml-js')
let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 800,
    autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(`${__dirname}/scripts/`, 'preload.js')
    }
  })

  ipcMain.on('data', (event, data) => {

    
    let jsonData = Object.fromEntries(data)

    const numericDate = jsonData.numericDate

    jsonData = {
      "runlog": [{
        "date": jsonData.logDate,
        "runners": jsonData.runnersNames,
        "operations": {
          "site": [
            {
              "name": "Loma Amarilla",
              "turnOn": jsonData.lomaStart ? jsonData.lomaStart : "",
              "turnOff": jsonData.lomaStop ? jsonData.lomaStop : ""
            },
            {
              "name": "Coihueco",
              "turnOn": jsonData.coihuecoStart ? jsonData.coihuecoStart : "",
              "turnOff": jsonData.coihuecoStop ? jsonData.coihuecoStop : ""
            }
          ]
        },
        "summary": {
          "hardware": jsonData.hardwareIssues ? jsonData.hardwareIssues : "",
          "software": jsonData.softwareIssues ? jsonData.softwareIssues : "",
          "data": jsonData.dataIssues ? jsonData.dataIssues : "",
          "weather": jsonData.weatherIssues ? jsonData.weatherIssues : ""
        },
        "comments": jsonData.detailedComments ? jsonData.detailedComments : ""
      }]
    }

    const xmlOptions = {compact: true, ignoreComment: true, spaces: 2}
    const xmlResult = convert.json2xml(jsonData, xmlOptions)
 
    writeFileSync(`./lidar-runlog-${numericDate}.xml`,`<?xml version="1.0" encoding="iso-8859-1"?><?xml-stylesheet type="text/xsl" href="runlog.xsl"?>
    ${xmlResult}`)

    const scp = spawn('scp', [`./lidar-runlog-${numericDate}.xml`,'weblidar@168.96.149.35:web/runlog/logs']);

    scp.stderr.on('data', data => {
  	dialog.showMessageBox(win,{type:"error",title:"Oops! An error occurred while copying log to lidar.auger.org.ar",message:`Error: ${data}`})
   })

  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
