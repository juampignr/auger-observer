const { contextBridge,ipcRenderer } = require('electron/renderer')


contextBridge.exposeInMainWorld('ipc', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    send: (data) => ipcRenderer.send("data",data),
})