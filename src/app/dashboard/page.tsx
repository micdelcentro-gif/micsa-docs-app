'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

type Doc = {
  id: string
  tipo: string
  folio: string | null
  cliente_nombre: string | null
  created_at: string
}

const TIPO_LABELS: Record<string, string> = {
  cotizacion: 'Cotización',
  bitacora: 'Bitácora',
  contrato: 'Contrato',
  orden_trabajo: 'Orden de Trabajo',
  requisicion: 'Requisición',
  entrega_epp: 'Entrega EPP',
  costos_adicionales: 'Costos Adicionales',
  checklist_izaje: 'Checklist Izaje',
  plan_izaje: 'Plan de Izaje',
  reporte_avance: 'Reporte de Avance',
  expediente_financiero: 'Expediente Financiero',
  carta_formal_direccion: 'Carta Formal',
  carta_respuesta_hallazgos: 'Carta Respuesta',
  anexo_hallazgos: 'Anexo Hallazgos',
  indice_paquete: 'Índice Paquete',
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('documentos')
        .select('id, tipo, folio, cliente_nombre, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setDocs(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = docs.filter(d =>
    !search ||
    (d.folio || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.cliente_nombre || '').toLowerCase().includes(search.toLowerCase()) ||
    TIPO_LABELS[d.tipo]?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Buscar por folio, cliente o tipo…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Cargando documentos…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📋</div>
          <div className="text-slate-500 text-sm">{search ? 'Sin resultados' : 'No hay documentos aún'}</div>
          <button
            onClick={() => router.push('/dashboard/nuevo')}
            className="mt-4 bg-blue-900 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-800"
          >
            Crear primer documento
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => (
            <div
              key={doc.id}
              onClick={() => router.push(`/dashboard/doc/${doc.id}`)}
              className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">
                  {TIPO_LABELS[doc.tipo] || doc.tipo}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {doc.folio || 'Sin folio'} {doc.cliente_nombre ? `· ${doc.cliente_nombre}` : ''}
                </div>
              </div>
              <div className="text-xs text-slate-400 shrink-0">
                {new Date(doc.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </div>
              <div className="text-slate-300 shrink-0">›</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
