import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MICSA Docs',
  description: 'Generador de documentos Grupo MICSA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&family=Barlow+Condensed:wght@700;900&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          *{box-sizing:border-box;}
          ::-webkit-scrollbar{width:5px;}
          ::-webkit-scrollbar-track{background:#0a1628;}
          ::-webkit-scrollbar-thumb{background:#334;border-radius:3px;}
          input:focus,textarea:focus,select:focus{border-color:#1a3a6b!important;box-shadow:0 0 0 3px rgba(26,58,107,0.12);}
        `}} />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
