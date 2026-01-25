import http from 'http';
import { readFileSync, existsSync, createReadStream } from 'fs';
import { extname, join, dirname } from 'path';
import { networkInterfaces } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultPort = process.env.PORT || 8080;
const distDir = join(__dirname, 'docs');

function getLocalIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const url = req.url || '/';
  // Remove query string
  const cleanUrl = url.split('?')[0];
  
  let filepath = cleanUrl === '/' ? 'index.html' : cleanUrl.slice(1);
  let fullPath = join(distDir, filepath);

  // If path is a directory (or empty), try index.html
  // But here we rely on the specific file request or default to index.html for root
  
  if (!existsSync(fullPath)) {
    // Check if it might be an HTML file without extension (e.g. /table -> /table.html)
    if (existsSync(fullPath + '.html')) {
        fullPath += '.html';
    } else {
        console.log(`404: ${url} -> ${fullPath}`);
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
    }
  }

  const type = mime[extname(fullPath)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  
  const stream = createReadStream(fullPath);
  stream.pipe(res);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Port ${defaultPort} is in use, trying ${defaultPort + 1}...`);
    server.listen(defaultPort + 1);
  } else {
    console.error(e);
  }
});

server.listen(defaultPort, () => {
  const ip = getLocalIP();
  const port = server.address().port;
  console.log(`Static Server serving ${distDir}`);
  console.log(`- Local:   http://localhost:${port}/`);
  console.log(`- Network: http://${ip}:${port}/`);
});
