'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const TIERS = ['T15', 'T35', 'T65', 'T75', 'T85', 'T100']

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ username: '', password: '', tier: 'T65' })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) router.push('/admin/login')
    else loadUsers()
  }, [])

  async function loadUsers() {
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: 'Bearer ' + token },
    })
    const data = await res.json()
    if (data.error) { setMsg('Error: ' + data.error); return }
    setUsers(data.users)
  }

  async function createUser() {
    setMsg('Membuat user...')
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/admin/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.error) { setMsg('Gagal: ' + data.error); return }
    setMsg('User ' + form.username + ' dibuat')
    setForm({ username: '', password: '', tier: 'T65' })
    loadUsers()
  }

  async function updateUser(id: string, patch: any) {
    const token = localStorage.getItem('admin_token')
    await fetch('/api/admin/users/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ id, ...patch }),
    })
    loadUsers()
  }

  async function deleteUser(id: string, username: string) {
    if (!confirm('Hapus user ' + username + '?')) return
    const token = localStorage.getItem('admin_token')
    await fetch('/api/admin/users/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ id }),
    })
    loadUsers()
  }

  function logout() {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const box = {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(20px)',
    padding: 20,
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.2)',
    marginBottom: 16,
  }

  const inp = {
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0C29, #302B63, #24243E)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: 20,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0 }}>Clotso-X Admin</h1>
          <button onClick={logout} style={{ ...inp, background: 'rgba(255,80,80,0.3)', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Buat User Baru</h2>
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={inp}
          />
          <input
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inp}
          />
          <select
            value={form.tier}
            onChange={(e) => setForm({ ...form, tier: e.target.value })}
            style={inp}
          >
            {TIERS.map((t) => <option key={t} value={t} style={{ color: 'black' }}>{t}</option>)}
          </select>
          <button
            onClick={createUser}
            style={{ ...inp, background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Buat
          </button>
        </div>

        {msg && <p style={{ opacity: 0.8 }}>{msg}</p>}

        <div style={box}>
          <h2 style={{ marginTop: 0 }}>Daftar User ({users.length})</h2>
          {users.map((u) => (
            <div
              key={u.id}
              style={{
                padding: 12, marginBottom: 8,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 12, display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', gap: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 150 }}>
                <strong>{u.username}</strong>
                <div style={{ fontSize: 12, opacity: 0.6 }}>
                  {u.tier} • {u.status} • device: {u.deviceId ? 'bound' : 'free'}
                </div>
              </div>
              <select
                value={u.tier}
                onChange={(e) => updateUser(u.id, { tier: e.target.value })}
                style={{ ...inp, margin: 0 }}
              >
                {TIERS.map((t) => <option key={t} value={t} style={{ color: 'black' }}>{t}</option>)}
              </select>
              <button
                onClick={() => updateUser(u.id, { resetDevice: true })}
                style={{ ...inp, margin: 0, cursor: 'pointer' }}
              >
                Reset Device
              </button>
              <button
                onClick={() => updateUser(u.id, { status: u.status === 'active' ? 'banned' : 'active' })}
                style={{
                  ...inp, margin: 0, cursor: 'pointer',
                  background: u.status === 'active' ? 'rgba(255,200,0,0.3)' : 'rgba(0,200,0,0.3)',
                }}
              >
                {u.status === 'active' ? 'Ban' : 'Unban'}
              </button>
              <button
                onClick={() => deleteUser(u.id, u.username)}
                style={{ ...inp, margin: 0, cursor: 'pointer', background: 'rgba(255,80,80,0.3)' }}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
