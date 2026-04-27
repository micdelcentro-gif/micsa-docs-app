# Deploy Instructions — MICSA Docs App

## 🔧 Aplicar Migraciones a Supabase

### Opción 1: Supabase Dashboard (Manual)

1. Ve a tu proyecto Supabase en https://supabase.com
2. Abre **SQL Editor** > **New Query**
3. Copia y pega el contenido de cada migración en este orden:

#### Migración 1: Folio System
Archivo: `supabase/migrations/001_folio_system.sql`

```sql
-- [Copiar contenido completo del archivo 001_folio_system.sql]
```

4. Click **Execute** ▶️

#### Migración 2: Versioning
Archivo: `supabase/migrations/002_add_versioning.sql`

```sql
-- [Copiar contenido completo del archivo 002_add_versioning.sql]
```

5. Click **Execute** ▶️

---

### Opción 2: Supabase CLI (Automatizado)

Si tienes Supabase CLI instalado:

```bash
cd /Users/jordangonzalez/Desktop/micsa-docs-plantillas

# Conectar con tu proyecto
supabase link --project-ref [tu-project-id]

# Aplicar migraciones
supabase db push
```

Para obtener tu `project-ref`:
1. Ve a https://supabase.com/dashboard/projects
2. Selecciona tu proyecto MICSA
3. En Settings > General, copia el Project Reference ID

---

## ✅ Verificar que las Migraciones se Aplicaron

En Supabase SQL Editor, ejecuta:

```sql
-- Verificar tabla document_counters
SELECT * FROM document_counters;

-- Verificar columnas en documentos
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'documentos' ORDER BY ordinal_position;

-- Verificar funciones RPC
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name LIKE '%folio%';
```

Esperado:
- ✓ Tabla `document_counters` con 21 tipos de documento
- ✓ Columnas `version` (int) y `version_history` (jsonb) en `documentos`
- ✓ Función `rpc_generate_folio` disponible

---

## 🚀 Deploy a Producción

### 1. Verificar Variables de Entorno

```bash
# Copiar ejemplo a .env.local
cp .env.local.example .env.local

# Editar con tus credenciales Supabase reales
# NEXT_PUBLIC_SUPABASE_URL=https://[tu-id].supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Testear Localmente

```bash
npm run dev
# Visita http://localhost:3000
```

**Checklist de Testing:**
- [ ] Crear nueva Cotización → Verifica que folio se genera (MICSA-COT-0001)
- [ ] Entrar monto_mxn: 10000 → Verifica IVA auto-calcula (1600) y Total (11600)
- [ ] Dibujar firma en Bitácora → Guardar → Verifica que se guarda
- [ ] Editar documento → Guardar → Ver historial → Verifica v1, v2, etc.
- [ ] Restaurar v1 desde historial → Verifica que data se restaura

### 4. Deploy a Vercel

```bash
# Si aún no está conectado
vercel link

# Deploy
npm run build
vercel deploy --prod
```

---

## 📋 Resumen de Cambios en Producción

### Tablas Nuevas
- `public.document_counters` — Almacena secuencia de folios por tipo

### Funciones Nuevas
- `public.generate_folio(p_doc_type)` — Genera folio único (PL/pgSQL)
- `public.rpc_generate_folio(p_doc_type)` — Wrapper RPC para Next.js

### Columnas Nuevas en `documentos`
- `version` (int) — Versión actual (default 1)
- `version_history` (jsonb) — Array de snapshots históricos

### Frontend (Next.js)
- ✓ Folio automático on save
- ✓ IVA 16% auto-calcula
- ✓ Firmas digitales (canvas)
- ✓ Versionado con restore
- ✓ Brand colors (NAVY/GOLD/RED)

---

## 🛠 Troubleshooting

### Error: "function rpc_generate_folio does not exist"
→ Ejecuta migración 001_folio_system.sql

### Error: "column version does not exist"
→ Ejecuta migración 002_add_versioning.sql

### Firmas no se guardan
→ Verifica que `datos` JSONB está configurado correctamente en schema
→ Verifica que las firmas (base64 PNG) caben en el límite de JSONB

### Versiones no aparecen
→ Verifica que `version_history` existe en tabla documentos
→ Verifica que `loadVersions()` fetch está trayendo datos de BD

---

## 📞 Support

Si encuentras issues:
1. Revisa los logs en Vercel Dashboard
2. Verifica Supabase logs en https://supabase.com/dashboard/[project]/logs
3. Usa browser DevTools > Console para errores de frontend

---

**Estimated Deploy Time:** 5-10 minutos
**Rollback Plan:** Las migraciones son idempotentes (CREATE IF NOT EXISTS), puedes re-ejecutarlas sin problemas
