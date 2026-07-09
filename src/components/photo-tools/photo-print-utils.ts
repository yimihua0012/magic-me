export type PaperSpec = {
  id: string
  label: string
  widthMm: number
  heightMm: number
}

export const paperSpecs: PaperSpec[] = [
  { id: '3r', label: '3R photo paper - 3.5 x 5 inch', widthMm: 88.9, heightMm: 127 },
  { id: '4x6', label: '4 x 6 inch photo paper', widthMm: 101.6, heightMm: 152.4 },
  { id: '5x7', label: '5 x 7 inch photo paper', widthMm: 127, heightMm: 177.8 },
  { id: '6x8', label: '6 x 8 inch photo paper', widthMm: 152.4, heightMm: 203.2 },
  { id: '8x10', label: '8 x 10 inch photo paper', widthMm: 203.2, heightMm: 254 },
  { id: 'a6', label: 'A6 paper - 105 x 148 mm', widthMm: 105, heightMm: 148 },
  { id: 'a5', label: 'A5 paper - 148 x 210 mm', widthMm: 148, heightMm: 210 },
  { id: 'a4', label: 'A4 paper', widthMm: 210, heightMm: 297 },
  { id: 'letter', label: 'US Letter', widthMm: 215.9, heightMm: 279.4 },
  { id: 'legal', label: 'US Legal', widthMm: 215.9, heightMm: 355.6 },
]

export function mmToPx(mm: number, dpi: number) {
  return Math.round((mm / 25.4) * dpi)
}

export async function loadImage(url: string) {
  const blobUrl = await fetchImageBlobUrl(url)
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      resolve(image)
    }
    image.onerror = () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      reject(new Error('Could not load the selected image for export.'))
    }
    image.crossOrigin = 'anonymous'
    image.src = blobUrl || url
  })
}

async function fetchImageBlobUrl(url: string) {
  try {
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) return ''
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch {
    return ''
  }
}

export function calculatePrintLayout(photoWidth: number, photoHeight: number, dpi: number, paper: PaperSpec) {
  const sheetWidth = mmToPx(paper.widthMm, dpi)
  const sheetHeight = mmToPx(paper.heightMm, dpi)
  const margin = mmToPx(5, dpi)
  const gap = mmToPx(3, dpi)
  const usableWidth = sheetWidth - margin * 2
  const usableHeight = sheetHeight - margin * 2
  const fitsSingle = photoWidth <= usableWidth && photoHeight <= usableHeight

  if (!fitsSingle) {
    return {
      sheetWidth,
      sheetHeight,
      margin,
      gap,
      columns: 0,
      rows: 0,
      totalCopies: 0,
      startX: margin,
      startY: margin,
      fits: false,
    }
  }

  const columns = Math.max(1, Math.floor((usableWidth + gap) / (photoWidth + gap)))
  const rows = Math.max(1, Math.floor((usableHeight + gap) / (photoHeight + gap)))
  const totalWidth = columns * photoWidth + (columns - 1) * gap
  const totalHeight = rows * photoHeight + (rows - 1) * gap

  return {
    sheetWidth,
    sheetHeight,
    margin,
    gap,
    columns,
    rows,
    totalCopies: columns * rows,
    startX: Math.max(margin, Math.floor((sheetWidth - totalWidth) / 2)),
    startY: Math.max(margin, Math.floor((sheetHeight - totalHeight) / 2)),
    fits: true,
  }
}

export function renderPrintSheet(photoCanvas: HTMLCanvasElement, dpi: number, paper: PaperSpec) {
  const layout = calculatePrintLayout(photoCanvas.width, photoCanvas.height, dpi, paper)
  if (!layout.fits) {
    throw new Error('The selected photo size does not fit the selected paper.')
  }

  const canvas = document.createElement('canvas')
  canvas.width = layout.sheetWidth
  canvas.height = layout.sheetHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not available in this browser.')

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, layout.sheetWidth, layout.sheetHeight)

  context.strokeStyle = '#cbd5e1'
  context.lineWidth = Math.max(1, Math.round(dpi / 300))

  for (let row = 0; row < layout.rows; row += 1) {
    for (let column = 0; column < layout.columns; column += 1) {
      const x = layout.startX + column * (photoCanvas.width + layout.gap)
      const y = layout.startY + row * (photoCanvas.height + layout.gap)
      context.drawImage(photoCanvas, x, y)
      context.strokeRect(x - 1, y - 1, photoCanvas.width + 2, photoCanvas.height + 2)
    }
  }

  return canvas
}

export async function downloadCanvas(canvas: HTMLCanvasElement, filename: string, quality = 0.94) {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
  if (!blob) throw new Error('Failed to create image file.')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
