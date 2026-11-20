import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {handleAi, gate} from './ai.mjs';

const root = path.resolve(fileURLToPath(new URL('./public/', import.meta.url)));
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json'
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/healthz') { res.writeHead(200, {'Content-Type': 'text/plain'}); return res.end('ok'); }
    if (await gate(req, res)) return;
    if (await handleAi(req, res)) return;
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!target.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    const data = await readFile(target);
    res.setHeader('Content-Type', MIME[path.extname(target)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, process.env.HOST || '0.0.0.0', () => console.log(`FACTUM is listening on port ${port}`));
