import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'

function App(): JSX.Element {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="brand">Kohinoor ERP</h1>
        <nav>
          <NavLink to="/" end className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className="nav-link">
            Inventory
          </NavLink>
          <span className="nav-link disabled">Approval (soon)</span>
          <span className="nav-link disabled">Reports (soon)</span>
          <span className="nav-link disabled">Production (soon)</span>
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
