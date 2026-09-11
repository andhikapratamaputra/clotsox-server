'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function doLogin() {
    setMsg('Loading...')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (data.error) {
      setMsg('Gagal: ' + data.error)
      return
    }
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_username', data.admin.username)
    router.push('/admin/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0C29, #302B63, #24243E)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
      padding: 20,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        padding: 32,
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.2)',
        width: '100%',
        maxWidth: 380,
      }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Clotso-X</h1>
        <p style={{ opacity: 0.7, marginTop: 4, marginBottom: 24 }}>Admin Panel</p>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%', padding: 14, marginBottom: 12, borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white', boxSizing: 'border-box',
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%', padding: 14, marginBottom: 20, borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white', boxSizing: 'border-box',
          }}
        />

        <button
          onClick={doLogin}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)',
            color: 'white', fontWeight: 'bold', fontSize: 14, cursor: 'pointer',
          }}
        >
          LOGIN
        </button>

        {msg && <p style={{ marginTop: 16, fontSize: 13, opacity: 0.8 }}>{msg}</p>}
      </div>
    </div>
  )
}
