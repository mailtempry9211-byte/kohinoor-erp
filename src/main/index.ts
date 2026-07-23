import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { IPC, type InventoryItem } from '../shared/ipc-channels'
import { initDatabase } from './database'
import * as Inventory from './modules/inventory'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Dev mode mein Vite dev server, production build mein bundled HTML file.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle(IPC.APP_GET_VERSION, () => app.getVersion())

  ipcMain.handle(IPC.INVENTORY_GET_ALL, () => Inventory.getAllItems())

  ipcMain.handle(IPC.INVENTORY_ADD, (_event, item: InventoryItem) => Inventory.addItem(item))

  ipcMain.handle(IPC.INVENTORY_UPDATE, (_event, item: InventoryItem) => Inventory.updateItem(item))

  ipcMain.handle(IPC.INVENTORY_DELETE, (_event, id: number) => Inventory.deleteItem(id))
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.kohinoor.erp')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initDatabase()
  registerIpcHandlers()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
