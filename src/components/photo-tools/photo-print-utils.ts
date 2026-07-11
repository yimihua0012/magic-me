export type PaperSpec = {
  id: string
  label: string
  widthMm: number
  heightMm: number
}

export type PhotoSpec = {
  id: string
  label: string
  widthMm: number
  heightMm: number
  dpi: number
}

export const photoSpecs: PhotoSpec[] = [
  { id: 'cn-1-inch', label: 'China 1 inch - 25 x 35 mm', widthMm: 25, heightMm: 35, dpi: 300 },
  { id: 'cn-2-inch', label: 'China 2 inch - 35 x 49 mm', widthMm: 35, heightMm: 49, dpi: 300 },
  { id: 'cn-small-2-inch', label: 'China small 2 inch - 35 x 45 mm', widthMm: 35, heightMm: 45, dpi: 300 },
  { id: 'cn-passport-reference', label: 'China passport reference - 33 x 48 mm', widthMm: 33, heightMm: 48, dpi: 300 },
  { id: 'us-2x2', label: 'United States 2 x 2 inch', widthMm: 50.8, heightMm: 50.8, dpi: 300 },
  { id: 'india-2x2', label: 'India 2 x 2 inch', widthMm: 50.8, heightMm: 50.8, dpi: 300 },
  { id: 'canada-50x70', label: 'Canada style - 50 x 70 mm', widthMm: 50, heightMm: 70, dpi: 300 },
  { id: 'uk-35x45', label: 'United Kingdom common - 35 x 45 mm', widthMm: 35, heightMm: 45, dpi: 300 },
  { id: 'eu-35x45', label: 'EU / Schengen common - 35 x 45 mm', widthMm: 35, heightMm: 45, dpi: 300 },
  { id: 'japan-35x45', label: 'Japan common - 35 x 45 mm', widthMm: 35, heightMm: 45, dpi: 300 },
  { id: 'korea-35x45', label: 'South Korea common - 35 x 45 mm', widthMm: 35, heightMm: 45, dpi: 300 },
  { id: 'hong-kong-40x50', label: 'Hong Kong common - 40 x 50 mm', widthMm: 40, heightMm: 50, dpi: 300 },
  { id: 'singapore-35x45', label: 'Singapore common - 35 x 45 mm', widthMm: 35, heightMm: 45, dpi: 300 },
  { id: 'malaysia-35x50', label: 'Malaysia common - 35 x 50 mm', widthMm: 35, heightMm: 50, dpi: 300 },
  { id: 'brazil-30x40', label: 'Brazil 3 x 4 cm', widthMm: 30, heightMm: 40, dpi: 300 },
  { id: 'square-avatar', label: 'Square badge / avatar - 50 x 50 mm', widthMm: 50, heightMm: 50, dpi: 300 },
]

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

export function photoSpecToPixels(spec: PhotoSpec) {
  return {
    width: mmToPx(spec.widthMm, spec.dpi),
    height: mmToPx(spec.heightMm, spec.dpi),
  }
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

export async function renderImageToPhotoCanvas({
  sourceUrl,
  spec,
  backgroundColor = '#ffffff',
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
}: {
  sourceUrl: string
  spec: PhotoSpec
  backgroundColor?: string | null
  zoom?: number
  offsetX?: number
  offsetY?: number
}) {
  const image = await loadImage(sourceUrl)
  const size = photoSpecToPixels(spec)
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not available in this browser.')

  if (backgroundColor) {
    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
  } else {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const coverScale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * zoom
  const drawWidth = image.naturalWidth * coverScale
  const drawHeight = image.naturalHeight * coverScale
  const drawX = (canvas.width - drawWidth) / 2 + (offsetX / 100) * canvas.width
  const drawY = (canvas.height - drawHeight) / 2 + (offsetY / 100) * canvas.height
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)

  return canvas
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

export async function downloadPngCanvas(canvas: HTMLCanvasElement, filename: string) {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Failed to create PNG file.')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
