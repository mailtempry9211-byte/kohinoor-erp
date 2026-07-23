import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// Database hamesha user's app-data folder mein banega,
// taaki install/uninstall/update se data delete na ho.
const userDataPath = app.getPath('userData')
if (!existsSync(userDataPath)) {
  mkdirSync(userDataPath, { recursive: true })
}

const dbPath = join(userDataPath, 'kohinoor-erp.db')

export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      unit TEXT NOT NULL DEFAULT 'pcs',
      price REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  // Future modules (dashboard, approval, reports, production) ke tables
  // yahin is function ke andar add hote jaayenge, ek-ek karke.
}
