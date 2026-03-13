'use client'
import { useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { ALCANCES_DEFAULT, INCLUYE_DEFAULT, EXCLUYE_DEFAULT, COND_DEFAULT, NOTA_SUP, LETTERS, LOGO_B64, MI, NAVY, RED, GOLD, fmtDate, fmtMXN } from '@/lib/constants'

/* ─── SCHEMAS ─────────────────────────────────────────────── */
const SCHEMAS: Record<string, { title: string; sections: { label: string; fields: { key: string; label: string; type: string; placeholder?: string; rows?: number; items?: string[] }[] }[] }> = {
  cotizacion: { title: 'Cotización de Servicios', sections: [
    { label: 'Datos del Documento', fields: [
      { key: 'cot_num', label: 'N° Cotización', type: 'text', placeholder: '028' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
    ]},
    { label: 'Datos del Cliente', fields: [
      { key: 'cliente', label: 'Cliente', type: 'text', placeholder: 'FORZA STEEL' },
      { key: 'planta', label: 'Planta', type: 'text' },
      { key: 'direccion_cliente', label: 'Dirección', type: 'text' },
      { key: 'atencion', label: 'Atención', type: 'text' },
      { key: 'contacto', label: 'Contacto / Tel', type: 'text' },
      { key: 'correo_cliente', label: 'Correo', type: 'text' },
      { key: 'referencia', label: 'Referencia', type: 'text', placeholder: 'Servicio.' },
    ]},
    { label: 'Servicio', fields: [
      { key: 'actividad', label: 'Actividad (título)', type: 'textarea', rows: 2 },
      { key: 'descripcion_personal', label: 'Descripción del personal', type: 'textarea', rows: 3 },
      { key: 'alcance_especifico', label: 'Alcance específico adicional', type: 'textarea', rows: 2 },
    ]},
    { label: 'Precio', fields: [
      { key: 'monto_usd', label: 'Monto USD (sin IVA)', type: 'number' },
      { key: 'monto_mxn', label: 'Monto MXN (sin IVA)', type: 'number' },
      { key: 'descripcion_precio', label: 'Descripción en tabla de precio', type: 'text' },
    ]},
    { label: 'Formas de Pago', fields: [
      { key: 'forma_pago', label: 'Forma de pago', type: 'textarea', rows: 2, placeholder: '50% anticipo.\n50% al finalizar.' },
      { key: 'tiempo_entrega', label: 'Tiempo de entrega', type: 'text' },
      { key: 'dias_anticipacion', label: 'Días anticipación OC', type: 'text', placeholder: '7' },
      { key: 'vigencia', label: 'Vigencia', type: 'text', placeholder: '15 días' },
      { key: 'base_info', label: 'Base de información', type: 'textarea', rows: 2 },
    ]},
  ]},
  bitacora: { title: 'Bitácora de Registro de Actividades Diarias', sections: [
    { label: 'Información General', fields: [
      { key: 'proyecto', label: 'Proyecto / ET', type: 'text' },
      { key: 'supervisor', label: 'Supervisor', type: 'text' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'area', label: 'Área de Trabajo', type: 'text' },
      { key: 'hora_inicio', label: 'Hora Inicio', type: 'time' },
      { key: 'hora_fin', label: 'Hora Fin', type: 'time' },
      { key: 'num_personas', label: 'No. Personas', type: 'number' },
      { key: 'folio', label: 'Folio', type: 'text' },
    ]},
    { label: 'Permisos', fields: [
      { key: 'permiso_caliente', label: 'Trabajo en Caliente (folio)', type: 'text', placeholder: 'N/A' },
      { key: 'permiso_rojo', label: 'Trabajo Rojo (folio)', type: 'text', placeholder: 'N/A' },
      { key: 'permiso_alturas', label: 'Trabajo en Alturas (folio)', type: 'text', placeholder: 'N/A' },
    ]},
    { label: 'Actividades', fields: [
      { key: 'resumen', label: 'Resumen Ejecutivo', type: 'textarea', rows: 3 },
      { key: 'actividades_detalle', label: 'Actividades Detalladas', type: 'textarea', rows: 4 },
    ]},
    { label: 'Firmas', fields: [
      { key: 'supervisor_micsa', label: 'Supervisor Grupo MICSA', type: 'text' },
      { key: 'usuario_cliente', label: 'Nombre Usuario por Cliente', type: 'text' },
    ]},
  ]},
}

// Default schema for other doc types
function defaultSchema(tipo: string, title: string) {
  return {
    title,
    sections: [{
      label: 'Información General',
      fields: [
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'cliente', label: 'Cliente', type: 'text' },
        { key: 'proyecto', label: 'Proyecto / Referencia', type: 'text' },
        { key: 'supervisor', label: 'Supervisor', type: 'text' },
        { key: 'descripcion', label: 'Descripción', type: 'textarea', rows: 4 },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 3 },
      ],
    }],
  }
}

const TIPO_TITLES: Record<string, string> = {
  cotizacion: 'Cotización Formal',
  bitacora: 'Bitácora Diaria',
  costos_adicionales: 'Costos Adicionales',
  checklist_izaje: 'Checklist de Izaje',
  orden_trabajo: 'Orden de Trabajo',
  contrato: 'Contrato de Servicios',
  requisicion: 'Requisición de Material',
  entrega_epp: 'Entrega de EPP',
  plan_izaje: 'Plan de Izaje',
  reporte_avance: 'Reporte de Avance',
}

/* ─── PHOTO UPLOADER ─────────────────────────────────────── */
function PhotoUploader({ documentoId, fotos, onFotosChange }: {
  documentoId?: string
  fotos: { url: string; path: string; name: string }[]
  onFotosChange: (f: { url: string; path: string; name: string }[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    if (!files.length) return
    setUploading(true)
    const newFotos = [...fotos]
    for (const file of Array.from(files)) {
      const path = `${documentoId || 'temp'}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('fotos-documentos').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('fotos-documentos').getPublicUrl(path)
        newFotos.push({ url: data.publicUrl, path, name: file.name })
      }
    }
    onFotosChange(newFotos)
    setUploading(false)
  }

  async function removePhoto(idx: number) {
    const foto = fotos[idx]
    await supabase.storage.from('fotos-documentos').remove([foto.path])
    onFotosChange(fotos.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
      >
        {uploading ? (
          <p className="text-slate-500 text-sm">Subiendo…</p>
        ) : (
          <>
            <div className="text-3xl mb-2">📷</div>
            <p className="text-sm text-slate-500">Toca para agregar fotos</p>
            <p className="text-xs text-slate-400 mt-1">Cámara o galería</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
      {fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {fotos.map((f, i) => (
            <div key={i} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt="" className="w-full h-full object-cover rounded-lg" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function NuevoTipoPage() {
  const params = useParams()
  const tipo = (params as { tipo: string }).tipo
  const router = useRouter()
  const supabase = createClient()

  const [data, setData] = useState<Record<string, string>>({})
  const [fotos, setFotos] = useState<{ url: string; path: string; name: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const title = TIPO_TITLES[tipo] || tipo
  const schema = SCHEMAS[tipo] || defaultSchema(tipo, title)

  function set(key: string, val: string) {
    setData(prev => ({ ...prev, [key]: val }))
  }

  const [folio, setFolio] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    // Generar folio automático solo en el primer guardado
    let docFolio = folio
    if (!savedId && !docFolio) {
      const { data: folioData } = await supabase.rpc('get_next_folio', { p_tipo: tipo })
      docFolio = folioData as string
      setFolio(docFolio)
    }

    const docData = {
      tipo,
      folio: docFolio,
      cliente_nombre: data.cliente || data.proyecto || null,
      datos: { ...data, fotos: fotos.map(f => f.url) },
      estado: 'borrador',
      created_by: user?.id,
    }
    if (savedId) {
      const { folio: _f, ...updateData } = docData
      await supabase.from('documentos').update(updateData).eq('id', savedId)
    } else {
      const { data: doc } = await supabase.from('documentos').insert(docData).select().single()
      if (doc) setSavedId(doc.id)
    }
    setSaving(false)
  }

  function handlePrint() {
    if (!printRef.current) return
    const html = printRef.current.innerHTML
    const w = window.open('', '_blank', 'width=900,height=700')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;900&display=swap" rel="stylesheet">
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'IBM Plex Sans',sans-serif;background:white}
        @media print{@page{margin:0;size:A4}}
      </style>
    </head><body>${html}</body></html>`)
    w.document.close()
    setTimeout(() => { w.focus(); w.print() }, 800)
  }

  return (
    <div className="max-w-lg mx-auto pb-4">
      {/* Header */}
      <div className="sticky top-14 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 z-10 no-print">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 text-xl">←</button>
        <h2 className="text-base font-bold text-slate-800 flex-1 truncate">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs border border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            {showPreview ? 'Editar' : 'Vista previa'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs bg-blue-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      {savedId && (
        <div className="mx-4 mt-3 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm flex items-center justify-between no-print">
          <span>✓ Guardado — <strong>{folio}</strong></span>
          <button onClick={handlePrint} className="text-green-800 font-semibold underline text-xs">Imprimir PDF</button>
        </div>
      )}

      {showPreview ? (
        /* PREVIEW */
        <div className="p-4">
          <button
            onClick={handlePrint}
            className="w-full mb-4 bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm no-print"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
          <div ref={printRef}>
            <DocumentPreview tipo={tipo} data={data} fotos={fotos} folio={folio} />
          </div>
        </div>
      ) : (
        /* FORM */
        <div className="p-4 space-y-6">
          {schema.sections.map((section, si) => (
            <div key={si} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700">{section.label}</h3>
              </div>
              <div className="p-4 space-y-3">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={data[field.key] || ''}
                        onChange={e => set(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={data[field.key] || ''}
                        onChange={e => set(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Photos section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">📷 Evidencia Fotográfica</h3>
            </div>
            <div className="p-4">
              <PhotoUploader
                documentoId={savedId || undefined}
                fotos={fotos}
                onFotosChange={setFotos}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {saving ? 'Guardando…' : '💾 Guardar Documento'}
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── DOCUMENT PREVIEW ──────────────────────────────────── */
function DocumentPreview({ tipo, data, fotos, folio }: {
  tipo: string
  data: Record<string, string>
  fotos: { url: string }[]
  folio?: string | null
}) {
  const tdL: React.CSSProperties = { padding: '5px 8px', fontWeight: 700, color: '#444', whiteSpace: 'nowrap', width: '100px', fontSize: '10px' }
  const tdV: React.CSSProperties = { padding: '5px 8px', color: '#111', fontSize: '10px', borderLeft: '1px solid #e5e7eb' }

  const Header = () => (
    <div style={{ borderBottom: `2px solid ${NAVY}`, paddingBottom: 10, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_B64} alt="Grupo MICSA" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
      <div style={{ textAlign: 'right', fontSize: 9, lineHeight: 1.8, color: '#444' }}>
        {data.fecha && <div style={{ fontWeight: 700, fontSize: 10, color: NAVY }}>Monclova Coahuila a {fmtDate(data.fecha)}</div>}
        <div>RFC: {MI.rfc}</div>
        {data.cot_num && <div style={{ fontWeight: 800, color: RED, fontSize: 10 }}>COTIZACIÓN. {data.cot_num}</div>}
      </div>
    </div>
  )

  const BHeader = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${NAVY}`, paddingBottom: 10, marginBottom: 12 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_B64} alt="Grupo MICSA" style={{ height: 60, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
      <div style={{ textAlign: 'center', flex: 1, padding: '0 12px' }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Barlow Condensed',sans-serif" }}>{title}</div>
          {folio && <div style={{ fontSize: 10, color: RED, fontWeight: 700, marginTop: 2 }}>{folio}</div>}
      </div>
      <div style={{ textAlign: 'right', fontSize: 8, color: '#666', lineHeight: 1.6, flexShrink: 0 }}>
        <div>REPSE: {MI.repse}</div>
        <div>{MI.tel1} | {MI.tel2}</div>
        <div>{MI.email}</div>
      </div>
    </div>
  )

  const Footer = ({ email }: { email?: string }) => (
    <div style={{ background: NAVY, color: 'white', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 8, marginTop: 'auto', flexWrap: 'wrap', gap: 4 }}>
      <span>{MI.dir}</span>
      <span>Cel- {MI.tel1} | Cel- {MI.tel2}</span>
      <span>{email || MI.email} | {MI.web} | {MI.emailJ}</span>
    </div>
  )

  const Watermark = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={LOGO_B64} alt="" aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '55%', opacity: 0.05, pointerEvents: 'none', zIndex: 0, userSelect: 'none' }} />
  )

  if (tipo === 'cotizacion') {
    const alcances = ALCANCES_DEFAULT
    const incluye = INCLUYE_DEFAULT
    const excluye = EXCLUYE_DEFAULT
    const monto = data.monto_usd
      ? `$${parseFloat(data.monto_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD MAS IVA`
      : data.monto_mxn ? fmtMXN(parseFloat(data.monto_mxn)) + ' MAS IVA' : '—'

    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 11, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
        <Watermark />
        <div style={{ padding: '16px 20px', flex: 1 }}>
          <Header />
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14, fontSize: 11 }}>
            <tbody>
              <tr><td style={tdL}>Cliente:</td><td style={tdV}>{data.cliente || '___'}</td><td style={tdL}>Referencia: {data.referencia || 'Servicio.'}</td></tr>
              <tr><td style={tdL}>Dirección</td><td style={tdV}>{data.direccion_cliente || '___'}</td><td style={tdV}>Planta: {data.planta || '___'}</td></tr>
              <tr><td style={tdL}>Atención.</td><td style={tdV}>{data.atencion || '___'}</td><td style={tdV} rowSpan={3}><em>{data.actividad || '___'}</em></td></tr>
              <tr><td style={tdL}>Contacto</td><td style={tdV}>{data.contacto || ''}</td></tr>
              <tr><td style={tdL}>Correo.</td><td style={tdV}>{data.correo_cliente || ''}</td></tr>
            </tbody>
          </table>

          <p style={{ margin: '0 0 12px', lineHeight: 1.8, textAlign: 'justify' }}>
            Estimado cliente:<br /><br />
            {`En respuesta a su amable solicitud, le presentamos nuestro presupuesto por los servicios de ${data.actividad || '[actividad]'} en planta ${data.planta || '[planta]'} ${data.direccion_cliente || ''}.`}
          </p>

          {data.descripcion_personal && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 4 }}>DESCRIPCIÓN.</div>
              <p style={{ margin: 0, lineHeight: 1.7, textAlign: 'justify' }}>{data.descripcion_personal}</p>
            </div>
          )}

          <div style={{ fontWeight: 800, textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.06em' }}>I. ALCANCES GENERALES</div>
          <div style={{ marginBottom: 14 }}>
            {alcances.map((a: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, lineHeight: 1.6, textAlign: 'justify' }}>
                <span style={{ fontWeight: 700, flexShrink: 0 }}>{LETTERS[i]}.</span><span>{a}</span>
              </div>
            ))}
            {data.alcance_especifico && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 5, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 700, flexShrink: 0 }}>{LETTERS[alcances.length]}.</span>
                <span>{data.alcance_especifico}</span>
              </div>
            )}
          </div>

          <div style={{ fontWeight: 800, textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.06em' }}>SIENDO NUESTRO PRECIO EL SIGUIENTE</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <thead>
              <tr style={{ background: NAVY, color: 'white' }}>
                <th style={{ padding: '7px 12px', textAlign: 'left', fontSize: 11 }}>DESCRIPCIÓN</th>
                <th style={{ padding: '7px 12px', textAlign: 'center', fontSize: 11, width: 130 }}>LÍNEA-ESTACIÓN</th>
                <th style={{ padding: '7px 12px', textAlign: 'right', fontSize: 11, width: 190 }}>COSTO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px', fontStyle: 'italic', fontWeight: 600 }}>{data.descripcion_precio || data.actividad || '___'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'center' }}>PLANTA.</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'right', fontWeight: 800 }}>{monto}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontWeight: 800, marginBottom: 5 }}>LA PRESENTE COTIZACIÓN INCLUYE:</div>
          <div style={{ marginBottom: 12, paddingLeft: 8 }}>{incluye.map((it: string, i: number) => <div key={i} style={{ lineHeight: 1.8 }}>{it}</div>)}</div>

          <div style={{ fontWeight: 800, marginBottom: 5 }}>EXCLUSIÓN:</div>
          <div style={{ marginBottom: 14, paddingLeft: 8 }}>{excluye.map((ex: string, i: number) => <div key={i} style={{ lineHeight: 1.8 }}>{i + 1}.- {ex}</div>)}</div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>NOTA.</div>
            {NOTA_SUP.split('\n\n').map((p: string, i: number) => (
              <p key={i} style={{ margin: '0 0 8px', lineHeight: 1.7, textAlign: 'justify', fontSize: 10, fontWeight: p.startsWith('MICSA EXPRESAMENTE') ? 700 : 400 }}>{p}</p>
            ))}
          </div>

          <div style={{ marginBottom: 14, fontSize: 10, lineHeight: 1.7 }}>
            {COND_DEFAULT.map((c: string, i: number) => (
              <div key={i} style={{ marginBottom: 4, display: 'flex', gap: 6 }}>
                <span style={{ flexShrink: 0, fontWeight: 700 }}>{i + 1}.-</span><span>{c}</span>
              </div>
            ))}
          </div>

          <div style={{ fontWeight: 800, marginBottom: 8 }}>FORMAS DE PAGO:</div>
          <div style={{ marginBottom: 16, fontSize: 11, lineHeight: 1.8 }}>
            <div><strong>1.</strong> La presente cotización está basada en la información proporcionada por <strong>{data.cliente || 'el cliente'}</strong>, {data.base_info || 'obtenida en el recorrido realizado con su supervisión'}.</div>
            <div style={{ marginTop: 6 }}><strong>2.</strong> Forma de pago: {data.forma_pago || '50% anticipo. 50% al finalizar.'}</div>
            <div><strong>3.</strong> Tiempo de entrega: {data.tiempo_entrega || 'A convenir.'}</div>
            <div><strong>4.</strong> Se solicitan {data.dias_anticipacion || '7'} días de anticipación a partir de la OC.</div>
            <div><strong>5.</strong> Vigencia: {data.vigencia || '15 días'}.</div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <div>Atentamente.</div><br />
            <div style={{ fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>TU SOCIO ESTRATÉGICO EN INSTALACIÓN DE MAQUINARIA</div>
          </div>
        </div>
        <Footer email={MI.emailCot} />
      </div>
    )
  }

  // Generic preview for other doc types
  const title = TIPO_TITLES[tipo] || tipo
  return (
    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 11, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
      <Watermark />
      <div style={{ padding: '16px 20px', flex: 1 }}>
        <BHeader title={title} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
          <tbody>
            {Object.entries(data).map(([k, v]) => v ? (
              <tr key={k}>
                <td style={tdL}>{k.replace(/_/g, ' ')}:</td>
                <td style={tdV}>{v}</td>
              </tr>
            ) : null)}
          </tbody>
        </table>
        {fotos.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', fontSize: 11 }}>Evidencia Fotográfica</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {fotos.map((f, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={f.url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 4 }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

const TIPO_TITLES: Record<string, string> = {
  cotizacion: 'Cotización Formal',
  bitacora: 'Bitácora Diaria',
  costos_adicionales: 'Costos Adicionales',
  checklist_izaje: 'Checklist de Izaje',
  orden_trabajo: 'Orden de Trabajo',
  contrato: 'Contrato de Servicios',
  requisicion: 'Requisición de Material',
  entrega_epp: 'Entrega de EPP',
  plan_izaje: 'Plan de Izaje',
  reporte_avance: 'Reporte de Avance',
}
