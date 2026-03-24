import { NextRequest, NextResponse } from 'next/server'
import {
      Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
      WidthType, AlignmentType, BorderStyle, Header, Footer,
      ImageRun, HeadingLevel, TabStopType, TabStopPosition,
      PageNumber, NumberFormat, ShadingType,
} from 'docx'
import { LOGO_B64, MI, ALCANCES_DEFAULT, INCLUYE_DEFAULT, EXCLUYE_DEFAULT, COND_DEFAULT, NOTA_SUP, LETTERS } from '@/lib/constants'

const NAVY = '0a1628'
const RED_HEX = 'd42b2b'
const GOLD_HEX = 'c8a84b'
const WHITE = 'FFFFFF'

function logoBuffer(): Buffer | null {
      try {
              const b64 = LOGO_B64.replace(/^data:image\/\w+;base64,/, '')
              return Buffer.from(b64, 'base64')
      } catch { return null }
}

function headerSection(folio?: string, fecha?: string) {
      const logo = logoBuffer()
      const children: Paragraph[] = []
            if (logo) {
                    children.push(new Paragraph({
                              children: [new ImageRun({ data: logo, transformation: { width: 180, height: 60 }, type: 'png' })],
                    }))
            }
      children.push(new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                        new TextRun({ text: 'GRUPO MICSA', bold: true, size: 28, color: NAVY, font: 'Arial' }),
                      ],
      }))
      if (fecha) {
              children.push(new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: `Monclova Coahuila a ${fecha}`, size: 18, color: NAVY, font: 'Arial' })],
              }))
      }
      if (folio) {
              children.push(new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: folio, bold: true, size: 20, color: RED_HEX, font: 'Arial' })],
              }))
      }
      return new Header({ children })
}

function footerSection() {
      return new Footer({
              children: [
                        new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                                  new TextRun({ text: MI.dir, size: 14, color: WHITE, font: 'Arial' }),
                                                  new TextRun({ text: `  |  Cel: ${MI.tel1}  |  ${MI.email}`, size: 14, color: WHITE, font: 'Arial' }),
                                                ],
                                    shading: { type: ShadingType.SOLID, color: NAVY, fill: NAVY },
                        }),
                      ],
      })
}

function sectionTitle(text: string): Paragraph {
      return new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 300, after: 200 },
              children: [
                        new TextRun({
                                    text: text.toUpperCase(),
                                    bold: true, size: 24, color: NAVY, font: 'Arial',
                        }),
                      ],
      })
}

function labelValue(label: string, value: string): Paragraph {
      return new Paragraph({
              spacing: { after: 80 },
              children: [
                        new TextRun({ text: `${label}: `, bold: true, size: 20, font: 'Arial', color: '444444' }),
                        new TextRun({ text: value || '—', size: 20, font: 'Arial' }),
                      ],
      })
}

function buildCotizacion(data: Record<string, string>, folio?: string) {
      const children: Paragraph[] = []

            // Client info
            children.push(labelValue('Cliente', data.cliente))
      children.push(labelValue('Dirección', data.direccion_cliente))
      children.push(labelValue('Atención', data.atencion))
      children.push(labelValue('Contacto', data.contacto))
      children.push(labelValue('Correo', data.correo_cliente))
      children.push(labelValue('Referencia', data.referencia || 'Servicio.'))
      children.push(labelValue('Planta', data.planta))

  // Intro
  children.push(new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [new TextRun({
                    text: `Estimado cliente:\n\nEn respuesta a su amable solicitud, le presentamos nuestro presupuesto por los servicios de ${data.actividad || '[actividad]'} en planta ${data.planta || '[planta]'} ${data.direccion_cliente || ''}.`,
                    size: 20, font: 'Arial',
          })],
  }))

  if (data.descripcion_personal) {
          children.push(new Paragraph({
                    children: [
                                new TextRun({ text: 'DESCRIPCIÓN.\n', bold: true, size: 20, font: 'Arial' }),
                                new TextRun({ text: data.descripcion_personal, size: 20, font: 'Arial' }),
                              ],
          }))
  }

  // Alcances
  children.push(sectionTitle('I. ALCANCES GENERALES'))
      ALCANCES_DEFAULT.forEach((a: string, i: number) => {
              children.push(new Paragraph({
                        spacing: { after: 80 },
                        children: [
                                    new TextRun({ text: `${LETTERS[i]}. `, bold: true, size: 20, font: 'Arial' }),
                                    new TextRun({ text: a, size: 20, font: 'Arial' }),
                                  ],
              }))
      })

  // Price
  children.push(sectionTitle('SIENDO NUESTRO PRECIO EL SIGUIENTE'))
      const monto = data.monto_usd
        ? `$${parseFloat(data.monto_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD MAS IVA`
              : data.monto_mxn
        ? `$${parseFloat(data.monto_mxn).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN MAS IVA`
              : '—'

  children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
                    new TableRow({
                                children: [
                                              new TableCell({
                                                              children: [new Paragraph({ children: [new TextRun({ text: 'DESCRIPCIÓN', bold: true, color: WHITE, size: 20, font: 'Arial' })] })],
                                                              shading: { type: ShadingType.SOLID, color: NAVY, fill: NAVY },
                                              }),
                                              new TableCell({
                                                              children: [new Paragraph({ children: [new TextRun({ text: 'COSTO', bold: true, color: WHITE, size: 20, font: 'Arial' })] })],
                                                              shading: { type: ShadingType.SOLID, color: NAVY, fill: NAVY },
                                              }),
                                            ],
                    }),
                    new TableRow({
                                children: [
                                              new TableCell({
                                                              children: [new Paragraph({ children: [new TextRun({ text: data.descripcion_precio || data.actividad || '—', size: 20, font: 'Arial', italics: true })] })],
                                              }),
                                              new TableCell({
                                                              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: monto, bold: true, size: 20, font: 'Arial' })] })],
                                              }),
                                            ],
                    }),
                  ],
  }))

  // Incluye / Excluye
  children.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: 'LA PRESENTE COTIZACIÓN INCLUYE:', bold: true, size: 20, font: 'Arial' })] }))
      INCLUYE_DEFAULT.forEach((it: string) => {
              children.push(new Paragraph({ children: [new TextRun({ text: it, size: 20, font: 'Arial' })] }))
      })

  children.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: 'EXCLUSIÓN:', bold: true, size: 20, font: 'Arial' })] }))
      EXCLUYE_DEFAULT.forEach((ex: string, i: number) => {
              children.push(new Paragraph({ children: [new TextRun({ text: `${i + 1}.- ${ex}`, size: 20, font: 'Arial' })] }))
      })

  // Nota
  children.push(new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'NOTA.', bold: true, size: 20, font: 'Arial' })] }))
      NOTA_SUP.split('\n\n').forEach((p: string) => {
              children.push(new Paragraph({ children: [new TextRun({ text: p, size: 18, font: 'Arial', bold: p.startsWith('MICSA EXPRESAMENTE') })] }))
      })

  // Condiciones
  COND_DEFAULT.forEach((c: string, i: number) => {
          children.push(new Paragraph({ children: [new TextRun({ text: `${i + 1}.- ${c}`, size: 18, font: 'Arial' })] }))
  })

  // Formas de pago
  children.push(new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: 'FORMAS DE PAGO:', bold: true, size: 20, font: 'Arial' })] }))
      children.push(new Paragraph({ children: [new TextRun({ text: `1. La presente cotización está basada en la información proporcionada por ${data.cliente || 'el cliente'}.`, size: 20, font: 'Arial' })] }))
      children.push(new Paragraph({ children: [new TextRun({ text: `2. Forma de pago: ${data.forma_pago || '50% anticipo. 50% al finalizar.'}`, size: 20, font: 'Arial' })] }))
      children.push(new Paragraph({ children: [new TextRun({ text: `3. Tiempo de entrega: ${data.tiempo_entrega || 'A convenir.'}`, size: 20, font: 'Arial' })] }))
      children.push(new Paragraph({ children: [new TextRun({ text: `4. Se solicitan ${data.dias_anticipacion || '7'} días de anticipación a partir de la OC.`, size: 20, font: 'Arial' })] }))
      children.push(new Paragraph({ children: [new TextRun({ text: `5. Vigencia: ${data.vigencia || '15 días'}.`, size: 20, font: 'Arial' })] }))

  // Cierre
  children.push(new Paragraph({
          spacing: { before: 400 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Atentamente.', size: 20, font: 'Arial' })],
  }))
      children.push(new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'TU SOCIO ESTRATÉGICO EN INSTALACIÓN DE MAQUINARIA', bold: true, size: 20, font: 'Arial' })],
      }))

  return children
}

function buildGenericDoc(tipo: string, data: Record<string, string>, folio?: string) {
      const children: Paragraph[] = []
            const title = tipo.replace(/_/g, ' ').toUpperCase()

  children.push(sectionTitle(title))
      if (folio) {
              children.push(new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: folio, bold: true, size: 20, color: RED_HEX, font: 'Arial' })],
              }))
      }

  Object.entries(data).forEach(([key, value]) => {
          if (value && key !== 'fotos') {
                    children.push(labelValue(key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value))
          }
  })

  return children
}

export async function POST(req: NextRequest) {
      try {
              const body = await req.json()
              const { tipo, data, folio } = body

        const isCotizacion = tipo === 'cotizacion'
              const docChildren = isCotizacion
                ? buildCotizacion(data || {}, folio)
                        : buildGenericDoc(tipo, data || {}, folio)

        const doc = new Document({
                  styles: {
                      default: {
                                    document: {
                                                    run: { font: 'Arial', size: 20 },
                                    },
                      },
                  },
                  sections: [{
                              properties: {
                                            page: {
                                                            margin: { top: 1200, bottom: 800, left: 1000, right: 1000 },
                                            },
                              },
                              headers: { default: headerSection(folio, data?.fecha) },
                              footers: { default: footerSection() },
                              children: docChildren,
                  }],
        })

        const buffer = await Packer.toBuffer(doc)
              const filename = `${folio || tipo || 'documento'}.docx`

        return new NextResponse(buffer, {
                  status: 200,
                  headers: {
                              'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              'Content-Disposition': `attachment; filename="${filename}"`,
                  },
        })
      } catch (error: unknown) {
              console.error('Error generating DOCX:', error)
              const message = error instanceof Error ? error.message : 'Unknown error'
              return NextResponse.json({ error: 'Failed to generate DOCX', details: message }, { status: 500 })
      }
}
