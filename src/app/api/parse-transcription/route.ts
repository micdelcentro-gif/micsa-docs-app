import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { transcripcion, campos } = await req.json()
    if (!transcripcion) return NextResponse.json({ error: 'Sin texto' }, { status: 400 })

    const camposStr = campos.map((c: { key: string; label: string }) => `- ${c.key}: ${c.label}`).join('\n')

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Extrae información estructurada del siguiente texto y mapéala a los campos disponibles del formulario. Devuelve SOLO un objeto JSON válido sin explicaciones ni markdown.

CAMPOS DISPONIBLES:
${camposStr}

TEXTO A ANALIZAR:
${transcripcion}

Responde ÚNICAMENTE con un objeto JSON donde las claves son los nombres de campo (key) y los valores son strings con la información extraída. Solo incluye campos que tengan información clara en el texto. No inventes datos.`
      }]
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'No se pudo parsear respuesta' }, { status: 500 })

    const extracted = JSON.parse(jsonMatch[0])
    return NextResponse.json({ data: extracted })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al procesar' }, { status: 500 })
  }
}
