import puppeteer from '/Users/john/develop/puppeteer/node_modules/puppeteer/index.js'
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, 'temporary_screenshots')
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const counterPath = join(outDir, '.counter')
let seq = 1
if (existsSync(counterPath)) {
  seq = parseInt(readFileSync(counterPath, 'utf-8').trim(), 10) || 1
}

const url = process.argv[2]
if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label]')
  process.exit(1)
}

const label = process.argv[3] || ''
const filename = label
  ? `screenshot-${seq}-${label}.png`
  : `screenshot-${seq}.png`

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Users/john/chrome/.cache/puppeteer/chrome/mac-149.0.7827.22/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })

  const filePath = join(outDir, filename)
  await page.screenshot({ path: filePath, fullPage: true })

  writeFileSync(counterPath, String(seq + 1))
  console.log(`Saved: ${filePath}`)

  await browser.close()
})()
