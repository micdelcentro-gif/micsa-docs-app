---
name: stack-tailwind
description: "Contexto de stack Tailwind CSS. Activa cuando el proyecto usa tailwindcss, clases utilitarias, tailwind.config."
---
# Stack Tailwind
- Mobile-first: sm: md: lg: en ese orden
- Extraer clases repetidas con @apply solo si se repiten 3+ veces
- Dark mode con class strategy, no media
- No purgar clases dinámicas — usar safelist si son dinámicas
- Componentes: clsx/cn para condicionales, no template strings
