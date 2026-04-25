# micsa-docs-app — CLAUDE.md

## Stack detectado

| Tecnología | Versión |
|---|---|
| Next.js | 14 (App Router) |
| React | 18 |
| TypeScript | ✓ |
| Tailwind CSS | ✓ |
| Supabase | Auth + DB + Storage |
| Netlify | Deploy + @netlify/plugin-nextjs |
| docx | Generación de Word |

## Skills activos

Los siguientes skills están disponibles en `.claude/skills/`:

- `stack-nextjs.md` — Next.js App Router, rutas dinámicas, Server/Client components
- `stack-supabase.md` — Auth, RLS, Storage, queries
- `stack-typescript.md` — tipos, interfaces, errores comunes
- `stack-tailwind.md` — utilidades CSS
- `stack-react.md` — hooks, estado, refs
- `micsa-docs.md` — contexto de plantillas y flujo de documentos MICSA
- `micsa-brain.md` — contexto maestro de Grupo MICSA
- `codigo-jordan.md` — doctrina de guerra administrativa industrial

## Estructura clave

```
src/app/
  dashboard/
    page.tsx                    # Lista de documentos + filtros
    nuevo/
      page.tsx                  # Selector de tipo de documento
      [tipo]/page.tsx           # Editor + preview + PDF (archivo principal ~2000 líneas)
    doc/[id]/page.tsx           # Vista de documento guardado
  api/
    generate-docx/              # Endpoint Word
    webhooks/                   # Crear, consultar, estado (n8n / Telegram)
```

## Tipos de documento activos

```
cotizacion, bitacora, costos_adicionales, checklist_izaje, orden_trabajo,
contrato, requisicion, entrega_epp, plan_izaje, reporte_avance,
manual_integral_seguridad, manual_operativo, propuesta_comercial,
codigo_etica, manual_reclutamiento, cotizacion_fimpress,
indice_paquete, expediente_financiero, carta_formal_direccion,
carta_respuesta_hallazgos, anexo_hallazgos
```

## Pre-llenado automático de formularios

`DEFAULTS` es una constante de módulo en `[tipo]/page.tsx` (fuera del componente).
Para agregar datos pre-llenados a un tipo nuevo:

```ts
const DEFAULTS: Record<string, Record<string, string>> = {
  expediente_financiero: { proyecto: '...', cliente: '...', ... },
  nuevo_tipo: { campo1: 'valor', campo2: 'valor' },
}
```

`useState` se inicializa con función lazy: `() => DEFAULTS[tipo] ?? {}`

## Patrón para agregar una plantilla nueva

1. Agregar schema en `SCHEMAS` (objeto en `[tipo]/page.tsx`)
2. Agregar entrada en `TIPO_TITLES`
3. Agregar renderer `if (tipo === 'nuevo_tipo') { return (...) }` antes del generic renderer
4. Agregar entrada en `TIPOS` array de `nuevo/page.tsx`
5. Agregar entrada en `TIPO_LABELS` de `dashboard/page.tsx`
6. `npm run build && netlify deploy --prod --site=8970e477-8fc0-4bf4-8247-5f7262c2eeb4`

## Deploy

```bash
# Site ID: 8970e477-8fc0-4bf4-8247-5f7262c2eeb4
# URL: https://micsa-docs-app.netlify.app
NETLIFY_AUTH_TOKEN=<token> npx netlify-cli deploy --prod --dir=.next --site=8970e477-8fc0-4bf4-8247-5f7262c2eeb4
```

## Supabase

- URL: `https://cwfuuuriegqddmntpmqe.supabase.co`
- Tabla principal: `documentos` (id, tipo, estado, cliente_nombre, folio, data jsonb, created_at)
- Storage bucket: `fotos-documentos`

---

# Código Jordan — Embebido

## Economía de tokens (OBLIGATORIO)
- Respuestas directas, sin saludos, sin introducciones, sin conclusiones
- Sin emojis salvo petición explícita
- Sin explicar conceptos que Jordan ya domina
- Entrega resultado final: código, JSON o lista de pasos numerados
- Si la respuesta es obvia o trivial, una línea basta

## Reglas de trabajo
- Trabaja en fases. No saltar pasos sin confirmación
- Leer archivos antes de modificarlos
- No crear archivos extra innecesarios
- No añadir manejo de errores especulativo
- Usar herramientas dedicadas (Read, Edit, Grep, Glob) sobre Bash cuando aplique

## Patrones del Látigo

| Código | Patrón | Acción correctiva |
|---|---|---|
| P1 | Commits circulares | Define qué cambia esta iteración |
| P2 | Thrashing de archivos | Para. Define criterio de éxito antes de editar |
| P3 | TODO estancado >24h | Elige UNA tarea. Márcala IN_PROGRESS |
| P4 | Sin avance neto | Descarta commits. Reescribe el problema |
| P5 | Error repetido 5x | Cambia enfoque. Escala a Jordan |

*"Puede faltar flujo, pero nunca posición."*
