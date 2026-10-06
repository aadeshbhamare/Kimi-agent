// Minimal client-side PDF generator (no dependencies).
// Produces real, downloadable multi-page PDF documents with Helvetica text.

interface PdfPageLine {
  text: string
  size?: number
  bold?: boolean
  gap?: number // extra leading before this line
  align?: 'left' | 'center'
}

export interface PdfPage {
  lines: PdfPageLine[]
  landscape?: boolean
}

function escapePdf(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7E]/g, '?')
}

export function buildPdf(pages: PdfPage[]): Blob {
  const objects: string[] = []
  const kids: string[] = []

  // Object 1: Catalog, 2: Pages, 3: Font regular, 4: Font bold
  objects[0] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'

  pages.forEach((page, i) => {
    const W = page.landscape ? 842 : 595
    const H = page.landscape ? 595 : 842
    const margin = 56
    let y = H - margin
    const cmds: string[] = []
    page.lines.forEach((line) => {
      const size = line.size ?? 11
      const leading = size * 1.45 + (line.gap ?? 0)
      y -= leading
      if (y < margin) return
      const font = line.bold ? 'F2' : 'F1'
      let x = margin
      if (line.align === 'center') {
        const approx = line.text.length * size * 0.5
        x = Math.max(margin, (W - approx) / 2)
      }
      cmds.push(`BT /${font} ${size} Tf ${x.toFixed(1)} ${y.toFixed(1)} Td (${escapePdf(line.text)}) Tj ET`)
    })
    const stream = cmds.join('\n')
    const contentObjNum = 5 + i * 2
    const pageObjNum = contentObjNum + 1
    objects[contentObjNum - 1] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    objects[pageObjNum - 1] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjNum} 0 R >>`
    kids.push(`${pageObjNum} 0 R`)
  })

  objects[1] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefPos = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.forEach((o) => {
    pdf += `${o.toString().padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
