export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0C29, #302B63, #24243E)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 20,
    }}>
      <h1 style={{ fontSize: 36, margin: 0 }}>Clotso-X</h1>
      <p style={{ opacity: 0.7 }}>Server is running</p>
      <a
        href="/admin/login"
        style={{
          marginTop: 20,
          padding: '12px 24px',
          borderRadius: 12,
          background: 'linear-gradient(90deg, #7C4DFF, #00E5FF)',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        Admin Panel
      </a>
    </div>
  )
}
