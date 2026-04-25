---
name: stack-supabase
description: "Contexto de stack Supabase. Activa cuando el proyecto usa @supabase/supabase-js, Supabase Auth, Supabase Storage, RLS policies."
---
# Stack Supabase
- RLS activo en todas las tablas — nunca deshabilitar
- Usar supabase.auth.getUser() server-side, no getSession() (inseguro)
- Tipos generados con: supabase gen types typescript
- Migrations en supabase/migrations/ — nunca editar la DB directamente
- Storage: buckets con políticas RLS, no públicos por defecto
