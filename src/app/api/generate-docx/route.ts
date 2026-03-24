import { NextRequest, NextResponse } from 'next/server'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST(req: NextRequest) {
    try {
          const body = await req.json()
          const { tipo, data, folio } = body

      // Load the .dotx template from public/templates/
      const templatePath = join(process.cwd(), 'public', 'templates', 'micsa-plantilla-definitiva.dotx')
          const content = readFileSync(templatePath)
          const zip = new PizZip(content)
          const doc = new Docxtemplater(zip, {
                  paragraphLoop: true,
                  linebreaks: true,
                  delimiters: { start: '{{', end: '}}' },
          })

      // Build template variables from the document data
      const templateData: Record<string, string> = {
              tipo: tipo || '',
              folio: folio || '',
              fecha: data?.fecha || '',
              cliente: data?.cliente || '',
              proyecto: data?.proyecto || '',
              supervisor: data?.supervisor || '',
              ...data,
      }

      doc.render(templateData)

      const buf = doc.getZip().generate({
              type: 'nodebuffer',
              compression: 'DEFLATE',
      })

      const filename = `${folio || tipo || 'documento'}.docx`

      return new NextResponse(buf, {
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
