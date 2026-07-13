import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const createJiti = require('jiti')

function loadEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename)
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex < 0) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env.local.td')

const jiti = createJiti(import.meta.url, {
  alias: {
    '@backend': path.join(process.cwd(), 'backend'),
    '@': path.join(process.cwd(), 'src'),
  },
})

const { PhotoProcessResultService } = jiti('../backend/services/photo-process-result.service.ts')

const sourceImage =
  process.argv[2] ||
  'https://oyjtcajkjrlvtttnbhdq.supabase.co/storage/v1/object/public/output-photos/internal-photo-generations/c6afbc64-970f-4a48-a773-fb7b69dfb766/internal.jpg'

const productType = process.argv[3] === 'portrait' ? 'portrait' : 'idphoto'
const orderid = `codex_process_test_${Date.now()}`
const outputUrls = productType === 'portrait'
  ? [
      sourceImage,
      sourceImage,
      sourceImage,
    ]
  : [sourceImage]

const task = await PhotoProcessResultService.createTask({
  openid: 'codex_test_openid',
  orderid,
  type: productType,
  taskId: 'codex-simulated-generation',
  outputUrls,
  metadata: { source: 'codex_process_result_test' },
})

console.log(JSON.stringify({
  phase: 'created',
  taskId: task.taskId,
  status: task.status,
  progress: task.progress,
  currentStep: task.currentStep,
  orderid,
}, null, 2))

await PhotoProcessResultService.processTask(task.taskId)

const completedTask = await PhotoProcessResultService.getTask(task.taskId)
const response = completedTask ? PhotoProcessResultService.toResponse(completedTask) : null

console.log(JSON.stringify({
  phase: 'completed',
  taskId: response?.taskId,
  status: response?.status,
  progress: response?.progress,
  currentStep: response?.currentStep,
  outputCount: response?.outputUrls?.length,
  outputUrls: response?.outputUrls,
  zipUrl: response?.zipUrl,
  error: response?.error,
}, null, 2))
