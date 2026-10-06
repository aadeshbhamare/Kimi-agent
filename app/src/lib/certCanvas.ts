import type { CertRecord, FitResult } from './data'

export interface RenderCertOptions {
  width?: number
  height?: number
  customImageUrl?: string | null
  customImageElement?: HTMLImageElement | null
  nameYPercent?: number // 0..100
  fontSizeFactor?: number
}

export function renderCertToCanvas(
  record: CertRecord,
  fit?: FitResult,
  options?: RenderCertOptions
): HTMLCanvasElement {
  const width = options?.width ?? 1684 // 2x resolution of 842x595
  const height = options?.height ?? 1190
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const customImg = options?.customImageElement

  if (customImg && customImg.complete && customImg.naturalWidth > 0) {
    // -------------------------------------------------------------------------
    // PRESERVE ORIGINAL IMAGE 100% AS-IS: Draw original template image untouched
    // -------------------------------------------------------------------------
    ctx.drawImage(customImg, 0, 0, width, height)
  } else {
    // Default luxury generated certificate template
    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, '#ffffff')
    bgGrad.addColorStop(0.5, '#f8fafc')
    bgGrad.addColorStop(1, '#f1f5f9')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // Subtle luxury background pattern
    ctx.save()
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.03)'
    ctx.lineWidth = 1
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    ctx.restore()

    // 2. Outer & Inner Borders (Design Lock)
    const margin = 50
    ctx.save()
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 6
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2)

    ctx.strokeStyle = '#c7d2fe'
    ctx.lineWidth = 2
    ctx.strokeRect(margin + 16, margin + 16, width - (margin + 16) * 2, height - (margin + 16) * 2)

    // Corner Ornaments
    const cornerSize = 48
    const corners = [
      [margin + 6, margin + 6],
      [width - margin - 6 - cornerSize, margin + 6],
      [margin + 6, height - margin - 6 - cornerSize],
      [width - margin - 6 - cornerSize, height - margin - 6 - cornerSize],
    ]
    ctx.fillStyle = '#4f46e5'
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx, cy, cornerSize, 6)
      ctx.fillRect(cx, cy, 6, cornerSize)
    })
    ctx.restore()

    // 3. Institution / College (Center Top)
    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = '#4f46e5'
    ctx.font = 'bold 26px "Inter", sans-serif'
    ctx.letterSpacing = '4px'
    ctx.fillText((record.college || 'TRINITY ACADEMY OF ENGINEERING').toUpperCase(), width / 2, 170)
    ctx.restore()

    // 4. Main Certificate Title
    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 58px "Georgia", serif'
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', width / 2, 270)
    ctx.restore()

    // Subtitle
    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = '#64748b'
    ctx.font = '24px "Inter", sans-serif'
    ctx.fillText('THIS CERTIFICATE IS PROUDLY PRESENTED TO', width / 2, 340)
    ctx.restore()
  }

  // ---------------------------------------------------------------------------
  // 5. Recipient Name with Adaptive Sizing
  // ---------------------------------------------------------------------------
  ctx.save()
  ctx.textAlign = 'center'
  const baseSize = fit?.fontSize ?? 34
  const multiplier = options?.fontSizeFactor ?? 2.1
  const canvasFontSize = Math.round(baseSize * multiplier)
  ctx.font = `bold ${canvasFontSize}px "Georgia", serif`
  ctx.fillStyle = '#1e1b4b'

  const nameY = options?.nameYPercent ? (height * options.nameYPercent) / 100 : 490

  const name = record.name || 'Recipient Name'
  if (fit?.lines && fit.lines > 1) {
    const words = name.split(' ')
    const mid = Math.ceil(words.length / 2)
    const line1 = words.slice(0, mid).join(' ')
    const line2 = words.slice(mid).join(' ')
    ctx.fillText(line1, width / 2, nameY - canvasFontSize * 0.6)
    ctx.fillText(line2, width / 2, nameY + canvasFontSize * 0.6)
  } else {
    ctx.fillText(name, width / 2, nameY)
  }

  // Underline for name
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(width / 2 - 280, nameY + 25)
  ctx.lineTo(width / 2 + 280, nameY + 25)
  ctx.stroke()
  ctx.restore()

  // 6. Achievement text & details
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = '#334155'
  ctx.font = '30px "Inter", sans-serif'
  const achievement = record.achievement || 'For outstanding performance and dedication'
  ctx.fillText(achievement, width / 2, nameY + 130)

  if (record.rank) {
    ctx.font = 'bold 22px "Inter", sans-serif'
    ctx.fillStyle = '#4338ca'
    ctx.fillText(`Rank: ${record.rank}`, width / 2, nameY + 180)
  }
  ctx.restore()

  // If not a custom image, draw default signatures and seal
  if (!customImg) {
    // 7. Signatures & Official Seal
    const sigY = 930
    ctx.save()
    // Left signature line
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(170, sigY)
    ctx.lineTo(470, sigY)
    ctx.stroke()

    ctx.font = 'bold 20px "Inter", sans-serif'
    ctx.fillStyle = '#1e293b'
    ctx.textAlign = 'center'
    ctx.fillText('Authorized Signature', 320, sigY + 36)
    ctx.font = '16px "Inter", sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Program Director', 320, sigY + 62)

    // Center Gold Verified Seal
    const sealX = width / 2
    const sealY = sigY - 20
    ctx.beginPath()
    ctx.arc(sealX, sealY, 56, 0, Math.PI * 2)
    ctx.fillStyle = '#eef2ff'
    ctx.fill()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#4f46e5'
    ctx.stroke()

    ctx.font = 'bold 16px "Inter", sans-serif'
    ctx.fillStyle = '#3730a3'
    ctx.fillText('VERIFIED', sealX, sealY - 6)
    ctx.font = 'bold 14px "Inter", sans-serif'
    ctx.fillText('OFFICIAL SEAL', sealX, sealY + 14)

    // Right signature line
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(width - 470, sigY)
    ctx.lineTo(width - 170, sigY)
    ctx.stroke()

    ctx.font = 'bold 20px "Inter", sans-serif'
    ctx.fillStyle = '#1e293b'
    ctx.fillText('Principal / Dean', width - 320, sigY + 36)
    ctx.font = '16px "Inter", sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Academic Council', width - 320, sigY + 62)
    ctx.restore()
  }

  // 8. Footer Metadata: Certificate Number and Date
  const margin = 50
  ctx.save()
  ctx.font = 'bold 18px "Courier New", monospace'
  ctx.fillStyle = '#475569'
  ctx.textAlign = 'left'
  ctx.fillText(`CERT ID: ${record.certNumber}`, margin + 30, height - margin - 24)

  ctx.textAlign = 'right'
  ctx.font = '18px "Inter", sans-serif'
  ctx.fillText(`Issued: ${record.date}`, width - margin - 30, height - margin - 24)
  ctx.restore()

  return canvas
}

export async function certPng(
  record: CertRecord,
  fit?: FitResult,
  options?: RenderCertOptions
): Promise<Blob> {
  let customImageElement: HTMLImageElement | null = null

  if (options?.customImageUrl) {
    try {
      customImageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = options.customImageUrl!
      })
    } catch {
      // If image loading fails, fall back to default template
      customImageElement = null
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const canvas = renderCertToCanvas(record, fit, {
        ...options,
        customImageElement,
      })
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to generate PNG blob'))
      }, 'image/png')
    } catch (e) {
      reject(e)
    }
  })
}
