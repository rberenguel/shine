#!/usr/bin/env node
/**
 * Tiny dev server for shine articles with live reload.
 * Usage: node serve.js <path-to-project-folder> [port]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const dir = path.resolve(process.argv[2] || '.');
const port = parseInt(process.argv[3] || '8080', 10);

if (!fs.existsSync(dir)) {
  console.error(`Directory not found: ${dir}`);
  process.exit(1);
}

const mime = {
  '.html': 'text/html', '.js': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
};

const lrScript = `
<script>
(() => {
  const es = new EventSource('/__livereload');
  es.onmessage = () => location.reload();
})();
</script>
`;

let clients = [];

const server = http.createServer((req, res) => {
  if (req.url === '/__livereload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
    clients.push(res);
    req.on('close', () => { clients = clients.filter(c => c !== res); });
    return;
  }

  const filePath = path.join(dir, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('Not found'); return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  if (ext === '.html') {
    content = content.replace('</body>', `${lrScript}</body>`);
  }

  res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
  res.end(content);
});

// Watch for changes
fs.watch(dir, { recursive: true }, (eventType, filename) => {
  if (filename && (filename.endsWith('.html') || filename.endsWith('.js') || filename.endsWith('.css'))) {
    clients.forEach(c => c.write('data: reload\n\n'));
    clients = [];
  }
});

server.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Serving ${dir} at ${url}`);
  console.log('Press Ctrl+C to stop');
  // Auto-open browser on macOS
  if (process.platform === 'darwin') exec(`open ${url}`);
});
