// Central place for all IPC channel names.
// Rule: koi bhi naya feature/channel add karo to yahin add karo,
// taaki main/preload/renderer teeno jagah naam match rahe.

export const IPC = {
  INVENTORY_GET_ALL: 'inventory:get-all',
  INVENTORY_ADD: 'inventory:add',
  INVENTORY_UPDATE: 'inventory:update',
  INVENTORY_DELETE: 'inventory:delete',
  APP_GET_VERSION: 'app:get-version'
} as const

export interface InventoryItem {
  id?: number
  name: string
  sku: string
  quantity: number
  unit: string
  price: number
  created_at?: string
  updated_at?: string
}
