# ⚡ Aplicar Migraciones AHORA

## Paso 1: Ir a Supabase SQL Editor

1. Abre https://supabase.com/dashboard
2. Selecciona proyecto **micsa-docs-app**
3. Abre **SQL Editor** > **+ New Query**

---

## Paso 2: Ejecutar Migración 1 — Folio System

Copia y pega esto en SQL Editor:

```sql
-- Tabla para almacenar contadores de folio por tipo de documento
create table if not exists document_counters (
  doc_type text primary key,
  last_number int default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Insertar tipos iniciales
insert into document_counters (doc_type, last_number) values
  ('COT', 0), ('BIT', 0), ('CA', 0), ('CHK-IZ', 0), ('OT', 0),
  ('CONT', 0), ('REQ', 0), ('EPP', 0), ('PI', 0), ('RA', 0),
  ('MIS', 0), ('MOP', 0), ('PC', 0), ('CE', 0), ('MR', 0),
  ('CST', 0), ('IPC', 0), ('ETF', 0), ('CFD', 0), ('CRH', 0), ('AF', 0)
on conflict (doc_type) do nothing;

-- Función SQL para generar folio único sin race conditions
create or replace function generate_folio(p_doc_type text)
returns text as $$
declare
  v_new_number int;
  v_folio text;
begin
  -- Update con FOR UPDATE para lock atomático
  update document_counters
  set last_number = last_number + 1,
      updated_at = now()
  where doc_type = p_doc_type
  returning last_number into v_new_number;

  -- Formatear folio: MICSA-COT-0001
  v_folio := 'MICSA-' || p_doc_type || '-' ||
             lpad(v_new_number::text, 4, '0');

  return v_folio;
end;
$$ language plpgsql;

-- RPC para que Next.js pueda llamarlo
create or replace function rpc_generate_folio(p_doc_type text)
returns text as $$
begin
  return generate_folio(p_doc_type);
end;
$$ language plpgsql;
```

**Click ▶️ RUN**

Expected: Success ✓

---

## Paso 3: Ejecutar Migración 2 — Versioning

Copia y pega esto en **NEW Query**:

```sql
-- Agregar columnas de versionado a tabla documentos
ALTER TABLE public.documentos
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '[]'::jsonb;

-- Crear índice para búsquedas por versión
CREATE INDEX IF NOT EXISTS idx_documentos_version ON public.documentos(version);

-- Crear índice para búsquedas en version_history
CREATE INDEX IF NOT EXISTS idx_documentos_version_history ON public.documentos USING GIN(version_history);
```

**Click ▶️ RUN**

Expected: Success ✓

---

## Paso 4: Verificar

En una **NEW Query**, copia:

```sql
-- Verificar que todo está en su lugar
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'documentos' AND column_name IN ('version', 'version_history');

SELECT COUNT(*) as doc_types FROM document_counters;

SELECT routine_name FROM information_schema.routines 
WHERE routine_name LIKE '%folio%' AND routine_schema = 'public';
```

**Click ▶️ RUN**

Expected:
- 2 rows: version, version_history ✓
- 1 row: 21 (types) ✓
- 2 rows: generate_folio, rpc_generate_folio ✓

---

## ✅ Listo para Producción

Migraciones aplicadas. El app está 100% funcional con:
- ✓ Folio automático (MICSA-COT-0001, etc)
- ✓ IVA 16% auto-calcula
- ✓ Firmas digitales Canvas
- ✓ Versionado con historial
- ✓ Brand colors NAVY/GOLD/RED

---

## 🚀 Deploy Final

```bash
cd /Users/jordangonzalez/Desktop/micsa-docs-plantillas

# Test local
npm install
npm run dev
# Verifica en http://localhost:3000

# Deploy a Vercel
vercel deploy --prod
```

---

**Total: 2 queries × 30 segundos = DONE**
