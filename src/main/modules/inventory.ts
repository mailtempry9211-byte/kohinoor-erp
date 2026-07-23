import { db } from '../database'
import type { InventoryItem } from '../../shared/ipc-channels'

export function getAllItems(): InventoryItem[] {
  return db.prepare('SELECT * FROM inventory ORDER BY id DESC').all() as InventoryItem[]
}

export function addItem(item: InventoryItem): InventoryItem {
  const stmt = db.prepare(
    `INSERT INTO inventory (name, sku, quantity, unit, price)
     VALUES (@name, @sku, @quantity, @unit, @price)`
  )
  const result = stmt.run(item)
  return db
    .prepare('SELECT * FROM inventory WHERE id = ?')
    .get(result.lastInsertRowid) as InventoryItem
}

export function updateItem(item: InventoryItem): InventoryItem {
  db.prepare(
    `UPDATE inventory
     SET name = @name, sku = @sku, quantity = @quantity, unit = @unit, price = @price,
         updated_at = datetime('now')
     WHERE id = @id`
  ).run(item)
  return db.prepare('SELECT * FROM inventory WHERE id = ?').get(item.id) as InventoryItem
}

export function deleteItem(id: number): void {
  db.prepare('DELETE FROM inventory WHERE id = ?').run(id)
}
