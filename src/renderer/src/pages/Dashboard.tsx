import { useEffect, useState } from 'react'

function Dashboard(): JSX.Element {
  const [version, setVersion] = useState<string>('...')

  useEffect(() => {
    window.api.getAppVersion().then(setVersion)
  }, [])

  return (
    <div className="page">
      <h2>Dashboard</h2>
      <p>Kohinoor ERP Desktop Edition — Foundation Build</p>
      <div className="card">
        <strong>App Version:</strong> {version}
        <br />
        <small>
          Ye line confirm karti hai ki Renderer ↔ Preload ↔ Main process teeno properly connect
          hain.
        </small>
      </div>
    </div>
  )
}

export default Dashboard
