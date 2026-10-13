// Şablonu Chromium'da kare kare çizer ve ffmpeg ile MP4'e (müzikle) dönüştürür.
//
// Kullanım (WORK klasöründe template.html, config.json, mapdata.json, music.wav olmalı):
//   node render.mjs WORK stills 3,10,30,55     -> WORK/still_<t>.jpg önizleme kareleri
//   node render.mjs WORK video OUT.mp4         -> tam video (30 fps, H.264 + AAC 48 kHz)
//
// Ortam: Playwright (Chromium). PLAYWRIGHT_BROWSERS_PATH veya CHROMIUM_PATH ile tarayıcı yolu verilebilir.
// Sayfa file:// yerine yerel HTTP sunucusundan açılır; aksi halde fetch/canvas güvenlik kısıtlarına takılır.
import { createRequire } from 'module';
import { spawn } from 'child_process';
import http from 'http'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
let chromium;
for (const m of ['playwright', '/opt/node22/lib/node_modules/playwright', 'playwright-core']) {
  try { ({ chromium } = require(m)); break; } catch {}
}
if (!chromium) { console.error('Playwright bulunamadı: npm i playwright'); process.exit(1); }

const [,, work, mode, arg] = process.argv;
const W = Number(process.env.VW || 1080), H = Number(process.env.VH || 1920), FPS = Number(process.env.FPS || 30);
const types = { '.html': 'text/html', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png' };
const root = path.resolve(work);
const srv = http.createServer((q, r) => {
  const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(root)) { r.writeHead(403); r.end(); return; }
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
}).listen(0, '127.0.0.1');
await new Promise(r => srv.once('listening', r));
const port = srv.address().port;

const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const b = await chromium.launch({ executablePath: exe, args: ['--no-proxy-server'] }).catch(() => chromium.launch({ args: ['--no-proxy-server'] }));
const p = await b.newPage({ viewport: { width: W, height: H } });
p.on('pageerror', e => console.log('sayfa hatası:', e.message));
p.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) console.log('konsol:', m.text()); });
await p.addInitScript(() => { window.__RENDER__ = true; });
await p.goto(`http://127.0.0.1:${port}/template.html`);
await p.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
const shot = async t => {
  await p.evaluate(t => renderFrame(t), t);
  return Buffer.from((await p.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', 0.92))).split(',')[1], 'base64');
};
if (mode === 'stills') {
  for (const t of arg.split(',').map(Number)) fs.writeFileSync(path.join(root, `still_${t}.jpg`), await shot(t));
  console.log('önizleme kareleri yazıldı');
} else {
  const total = await p.evaluate(() => TOTAL), n = Math.round(total * FPS);
  const music = path.join(root, 'music.wav');
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
  if (fs.existsSync(music)) args.push('-i', music, '-map', '0:v:0', '-map', '1:a:0', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2');
  else console.warn('UYARI: music.wav yok, video sessiz olacak!');
  args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-t', String(total), '-movflags', '+faststart', arg || 'video.mp4');
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    const buf = await shot(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log('kare', i, '/', n);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('video yazıldı:', arg || 'video.mp4', `(${total} sn)`);
}
await b.close(); srv.close();
