import http from 'http';
import { readFileSync, existsSync, createReadStream } from 'fs';
import { extname } from 'path';
import { networkInterfaces } from 'os';

const port = process.env.PORT || 8000;

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
  let filepath =
    url === '/' ? 'index.html' : url.slice(1);

  if (!existsSync(filepath)) {
    if (existsSync(filepath + '.js')) {
      filepath += '.js';
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
  }

  const type = mime[extname(filepath)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  if (extname(filepath) === '.html') {
    const content = readFileSync(filepath);
    res.end(content);
  } else {
    const stream = createReadStream(filepath);
    stream.pipe(res);
  }
});

server.listen(port, () => {
  const ip = getLocalIP();
  console.log(`Server running at:`);
  console.log(`- Local:   http://localhost:${port}/`);
  console.log(`- Network: http://${ip}:${port}/`);
});
