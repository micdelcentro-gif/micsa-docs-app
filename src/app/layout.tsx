import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MICSA Docs',
  description: 'Generador de documentos Grupo MICSA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
