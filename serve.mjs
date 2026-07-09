import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = parseInt(process.argv[2], 10) || 3000
const ROOT = join(__dirname, 'dist')

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
}

createServer((req, res) => {
  let path = req.url === '/' ? '/index.html' : req.url
  const filePath = join(ROOT, path)

  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
    return
  }

  const ext = extname(filePath)
  const mime = MIME[ext] || 'application/octet-stream'
  const content = readFileSync(filePath)

  res.writeHead(200, { 'Content-Type': mime, 'Content-Length': content.length })
  res.end(content)
}).listen(PORT, () => {
  console.log(`Serving ${ROOT} on http://localhost:${PORT}`)
})
