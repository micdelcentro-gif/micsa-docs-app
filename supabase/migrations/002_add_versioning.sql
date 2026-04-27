-- Agregar columnas de versionado a tabla documentos
ALTER TABLE public.documentos
ADD COLUMN IF NOT EXISTS version INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS version_history JSONB DEFAULT '[]'::jsonb;

-- Crear índice para búsquedas por versión
CREATE INDEX IF NOT EXISTS idx_documentos_version ON public.documentos(version);

-- Crear índice para búsquedas en version_history
CREATE INDEX IF NOT EXISTS idx_documentos_version_history ON public.documentos USING GIN(version_history);
