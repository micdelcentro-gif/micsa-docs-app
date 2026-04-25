---
name: stack-nextjs
description: "Contexto de stack Next.js. Activa cuando el proyecto usa next, app router, pages router, server components, server actions."
---
# Stack Next.js
- App Router por defecto (no pages router en proyectos nuevos)
- Server Components por defecto — solo 'use client' cuando sea necesario
- Server Actions para mutaciones — no crear endpoints API innecesarios
- fetch con cache: 'no-store' para datos dinámicos, revalidate para ISR
- Imágenes: siempre next/image con width/height explícitos
