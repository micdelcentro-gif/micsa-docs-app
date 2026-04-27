'use client'
import { useRef, useState } from 'react'

interface SignaturePadProps {
  onSignatureChange?: (signature: string) => void
  label?: string
  value?: string
}

export default function SignaturePad({ onSignatureChange, label = 'Firma Digital', value }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(!!value)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#000'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(false)
    ctx.closePath()

    const signature = canvas.toDataURL('image/png')
    setHasSignature(true)
    onSignatureChange?.(signature)
  }

  const clear = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    onSignatureChange?.('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-600">{label}</label>
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full bg-white cursor-crosshair block"
          style={{ touchAction: 'none' }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={clear}
          className="text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          Limpiar
        </button>
        <span className="text-xs text-slate-500 self-center">
          {hasSignature ? '✓ Firmado' : 'Dibuja tu firma'}
        </span>
      </div>
      {value && (
        <img src={value} alt="Firma" className="max-w-full h-auto border border-slate-200 rounded" style={{ maxHeight: 100 }} />
      )}
    </div>
  )
}
