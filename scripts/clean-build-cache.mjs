import { existsSync, rmSync } from 'node:fs'
import { resolve, sep } from 'node:path'

const root = process.cwd()
const targets = [resolve(root, '.next'), resolve(root, 'tsconfig.tsbuildinfo')]

function assertInsideProject(target) {
  const normalized = resolve(target)
  if (normalized !== root && !normalized.startsWith(`${root}${sep}`)) {
    throw new Error(`Refusing to remove path outside project: ${normalized}`)
  }
}

for (const target of targets) {
  assertInsideProject(target)

  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true })
    console.log(`[prebuild] Removed ${target.replace(`${root}${sep}`, '')}`)
  }
}
