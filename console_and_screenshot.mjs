import puppeteer from '/Users/john/develop/puppeteer/node_modules/puppeteer/index.js'
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, 'temporary_screenshots')
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const url = process.argv[2]
if (!url) {
  console.error('Usage: node console_and_screenshot.mjs <url> [label]')
  process.exit(1)
}

const label = process.argv[3] || ''
const logPath = join(outDir, `console.log`)

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Users/john/chrome/.cache/puppeteer/chrome/mac-149.0.7827.22/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const logs = []
  page.on('console', (msg) => {
    const text = `${msg.type().toUpperCase()}: ${msg.text()}`
    console.log(text)
    logs.push(text)
  })
  page.on('pageerror', (err) => {
    const text = `PAGEERROR: ${err.stack || err.message}`
    console.error(text)
    logs.push(text)
  })

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })

  const screenshotName = label ? `screenshot-console-${label}.png` : `screenshot-console.png`
  const filePath = join(outDir, screenshotName)
  await page.screenshot({ path: filePath, fullPage: true })

  writeFileSync(logPath, logs.join('\n'))
  console.log(`Saved screenshot: ${filePath}`)
  console.log(`Saved console log: ${logPath}`)

  await browser.close()
})()
