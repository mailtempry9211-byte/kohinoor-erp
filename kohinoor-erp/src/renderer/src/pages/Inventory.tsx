import { useEffect, useState, FormEvent } from 'react'
import type { InventoryItem } from '../../../shared/ipc-channels'

const emptyForm: InventoryItem = { name: '', sku: '', quantity: 0, unit: 'pcs', price: 0 }

function Inventory(): JSX.Element {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [form, setForm] = useState<InventoryItem>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string>('')

  async function loadItems(): Promise<void> {
    const data = await window.api.inventory.getAll()
    setItems(data)
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await window.api.inventory.update({ ...form, id: editingId })
      } else {
        await window.api.inventory.add(form)
      }
      setForm(emptyForm)
      setEditingId(null)
      await loadItems()
    } catch (err) {
      setError('SKU already exists ya koi aur error aayi. (' + String(err) + ')')
    }
  }

  function handleEdit(item: InventoryItem): void {
    setForm(item)
    setEditingId(item.id ?? null)
  }

  async function handleDelete(id: number): Promise<void> {
    await window.api.inventory.delete(id)
    await loadItems()
  }

  return (
    <div className="page">
      <h2>Inventory</h2>

      <form className="card form-grid" onSubmit={handleSubmit}>
        <input
          placeholder="Item name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          required
        />
        <input
          placeholder="Unit (pcs/kg/box)"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <button type="submit">{editingId ? 'Update Item' : 'Add Item'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm)
              setEditingId(null)
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error-text">{error}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => item.id && handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6}>Koi item nahi hai. Upar form se add karo.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Inventory
