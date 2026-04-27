import { createClient } from './supabase-browser'

export const DOC_TYPE_CODES: Record<string, string> = {
  cotizacion: 'COT',
  bitacora: 'BIT',
  costos_adicionales: 'CA',
  checklist_izaje: 'CHK-IZ',
  orden_trabajo: 'OT',
  contrato: 'CONT',
  requisicion: 'REQ',
  entrega_epp: 'EPP',
  plan_izaje: 'PI',
  reporte_avance: 'RA',
  manual_integral_seguridad: 'MIS',
  manual_operativo: 'MOP',
  propuesta_comercial: 'PC',
  codigo_etica: 'CE',
  manual_reclutamiento: 'MR',
  cotizacion_fimpress: 'CST',
  indice_paquete: 'IPC',
  expediente_financiero: 'ETF',
  carta_formal_direccion: 'CFD',
  carta_respuesta_hallazgos: 'CRH',
  anexo_hallazgos: 'AF',
}

export async function generateFolio(docType: string): Promise<string | null> {
  try {
    const code = DOC_TYPE_CODES[docType]
    if (!code) {
      console.error(`Unknown document type: ${docType}`)
      return null
    }

    const supabase = createClient()
    const { data, error } = await supabase.rpc('rpc_generate_folio', {
      p_doc_type: code,
    })

    if (error) {
      console.error('Error generating folio:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Exception in generateFolio:', err)
    return null
  }
}
