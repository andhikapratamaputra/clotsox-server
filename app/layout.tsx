export const metadata = {
  title: 'Clotso-X',
  description: 'Performance Optimizer Server',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
