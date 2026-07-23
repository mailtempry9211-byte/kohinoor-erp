import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC, type InventoryItem } from '../shared/ipc-channels'

const api = {
  getAppVersion: (): Promise<string> => ipcRenderer.invoke(IPC.APP_GET_VERSION),

  inventory: {
    getAll: (): Promise<InventoryItem[]> => ipcRenderer.invoke(IPC.INVENTORY_GET_ALL),
    add: (item: InventoryItem): Promise<InventoryItem> =>
      ipcRenderer.invoke(IPC.INVENTORY_ADD, item),
    update: (item: InventoryItem): Promise<InventoryItem> =>
      ipcRenderer.invoke(IPC.INVENTORY_UPDATE, item),
    delete: (id: number): Promise<void> => ipcRenderer.invoke(IPC.INVENTORY_DELETE, id)
  }
}

// contextIsolation on hai (Electron default, security ke liye best practice),
// isliye window object par seedha kuch daal nahi sakte - contextBridge use karna zaroori hai.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

export type Api = typeof api
