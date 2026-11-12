import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { mkdirSync, existsSync, readFileSync, writeFileSync, unlinkSync, statSync, createReadStream, readdirSync, copyFileSync } from 'node:fs';
import { resolve, join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const directory = resolve(process.env.DATA_DIR || join(root, '.studio'));
mkdirSync(join(directory, 'media'), { recursive: true });
const db = new DatabaseSync(join(directory, 'studio.sqlite'));
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY, json TEXT NOT NULL); CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, salt TEXT NOT NULL, hash TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS attempts (ip TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);');
const initial = { brand: 'smile-click-studio', media: [], collections: [], categories: ['WEDDINGS','PRE-WEDDINGS','ENGAGEMENTS','HALDI','CANDID MOMENTS','PORTRAITS'], settings: { ...JSON.parse(readFileSync(join(root,'src/studio/settings.json'),'utf8')), siteUrl: process.env.SITE_URL || '' } };
if (!db.prepare('SELECT id FROM content WHERE id=1').get()) db.prepare('INSERT INTO content VALUES (1,?)').run(JSON.stringify(initial));
const load = () => JSON.parse(db.prepare('SELECT json FROM content WHERE id=1').get().json);
const save = content => db.prepare('UPDATE content SET json=? WHERE id=1').run(JSON.stringify(content));
// Apply the user's corrected business identity without touching their media or accounts.
if (load().brand !== 'smile-click-studio') { const c = load(); c.settings = { ...initial.settings, siteUrl: c.settings.siteUrl || initial.settings.siteUrl }; c.brand = 'smile-click-studio'; save(c); }
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && !db.prepare('SELECT email FROM users LIMIT 1').get()) {
  if (process.env.ADMIN_PASSWORD.length < 14) throw new Error('ADMIN_PASSWORD must have at least 14 characters.');
  const salt = randomBytes(32).toString('hex');
  db.prepare('INSERT INTO users VALUES (?,?,?)').run(process.env.ADMIN_EMAIL.toLowerCase(), salt, scryptSync(process.env.ADMIN_PASSWORD, salt, 64).toString('hex'));
  console.log('Administrator account initialized. Remove ADMIN_PASSWORD from the running environment.');
}
if (process.argv.includes('--import-assets')) {
  const content = load();
  const add = (path, kind, title, poster) => { if (content.media.some(m => m.source === basename(path))) return; const id = randomUUID(); const extension = extname(path); copyFileSync(path, join(directory, 'media', id + extension)); let posterName = ''; if (poster && existsSync(poster)) { posterName = id + '.jpg'; copyFileSync(poster, join(directory, 'media', posterName)); } content.media.push({ id, kind, title, description: '', alt: title, category: 'WEDDINGS', url: `/api/media/${id}${extension}`, poster: posterName ? `/api/media/${posterName}` : '', orientation: basename(path).startsWith('DVSO3edkk0T') ? 'landscape' : 'portrait', featured: false, published: false, deleted: false, order: content.media.length, source: basename(path) }); };
  for (let i = 0; i < 36; i++) { const path = join(root, 'public/images', `photo-${String(i).padStart(2,'0')}.webp`); if (existsSync(path)) add(path, 'photo', `Wedding moment ${String(i + 1).padStart(2,'0')}`); }
  const videoDir = join(root, 'public/videos'); if (existsSync(videoDir)) for (const name of readdirSync(videoDir).filter(n => n.endsWith('.mp4'))) add(join(videoDir, name), 'film', 'Wedding film', join(videoDir, name.replace('.mp4','.jpg')));
  save(content); console.log(`Library contains ${content.media.length} items. Imports remain unpublished until reviewed.`); db.close(); process.exit(0);
}
const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
const production = process.env.NODE_ENV === 'production';
// Local loopback aliases share the same development origin and exact port.
function permittedOrigin(value) {
  if (value === origin) return true;
  if (production || !value) return false;
  try {
    const configured = new URL(origin), candidate = new URL(value);
    const local = host => ['localhost', '127.0.0.1', '[::1]'].includes(host);
    return local(configured.hostname) && local(candidate.hostname) && candidate.protocol === configured.protocol && candidate.port === configured.port;
  } catch { return false; }
}
if (production && !origin.startsWith('https://')) throw new Error('APP_ORIGIN must use HTTPS in production.');
const cookieName = production ? '__Host-studio_session' : 'studio_session';
const hashToken = token => createHash('sha256').update(token).digest('hex');
function authenticated(req) { const cookie = req.headers.cookie?.split(';').map(p => p.trim()).find(p => p.startsWith(cookieName + '='))?.slice(cookieName.length + 1); return cookie && db.prepare('SELECT token FROM sessions WHERE token=? AND expires>?').get(hashToken(cookie), Date.now()); }
function fail(status, message) { throw Object.assign(new Error(message), { status }); }
async function body(req, limit = 128 * 1024) { let size = 0; const chunks = []; for await (const chunk of req) { size += chunk.length; if (size > limit) fail(413, 'File exceeds the allowed size.'); chunks.push(chunk); } return Buffer.concat(chunks); }
async function json(req) { try { return JSON.parse((await body(req)).toString()); } catch (error) { if (error.status) throw error; fail(400, 'Invalid request data.'); } }
function text(value, max = 4000) { if (typeof value !== 'string' || value.length > max) fail(400, 'Invalid text field.'); return value.trim(); }
function mediaFields(data, previous) { const title = text(data.title, 200), alt = text(data.alt, 500), description = text(data.description, 4000), category = text(data.category, 100); if (!title || !alt || !description || !load().categories.includes(category)) fail(400, 'Title, description, alt text and a valid category are required.'); return { ...previous, title, alt, description, category, featured: !!data.featured, published: !!data.published, order: Number.isFinite(Number(data.order)) ? Number(data.order) : 0, orientation: data.orientation === 'landscape' ? 'landscape' : 'portrait' }; }
const types = { '.webp':'image/webp', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.mp4':'video/mp4', '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff2':'font/woff2' };
function stream(req, res, path, privateFile = false) { if (!existsSync(path) || !statSync(path).isFile()) fail(404, 'File not found.'); const size = statSync(path).size; const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Accept-Ranges':'bytes', 'Cache-Control': privateFile ? 'private, no-store' : 'public, max-age=3600' }; const range = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/); if (range) { const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2])); const end = range[1] ? (range[2] ? Math.min(size - 1, Number(range[2])) : size - 1) : size - 1; if (start > end || start >= size) { res.writeHead(416, { 'Content-Range':`bytes */${size}` }); res.end(); return; } res.writeHead(206, { ...headers, 'Content-Range':`bytes ${start}-${end}/${size}`, 'Content-Length':end-start+1 }); if (req.method === 'HEAD') res.end(); else createReadStream(path, { start, end }).pipe(res); } else { res.writeHead(200, { ...headers, 'Content-Length':size }); if (req.method === 'HEAD') res.end(); else createReadStream(path).pipe(res); } }
export const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('X-Frame-Options','DENY'); res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  if (production) res.setHeader('Strict-Transport-Security','max-age=31536000');
  const send = (status, value) => { res.writeHead(status, { 'Content-Type':'application/json', 'Cache-Control':'no-store' }); res.end(JSON.stringify(value)); };
  try {
    const path = new URL(req.url, origin).pathname; const method = req.method;
    if (permittedOrigin(req.headers.origin)) { res.setHeader('Access-Control-Allow-Origin', req.headers.origin); res.setHeader('Access-Control-Allow-Credentials','true'); res.setHeader('Vary','Origin'); }
    if (method === 'OPTIONS') { if (!permittedOrigin(req.headers.origin)) fail(403, 'Origin not permitted.'); res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE'); res.setHeader('Access-Control-Allow-Headers','Content-Type'); res.writeHead(204); res.end(); return; }
    if (!['GET','HEAD'].includes(method) && !permittedOrigin(req.headers.origin)) fail(403, 'Origin not permitted.');
    if (path === '/api/content' && method === 'GET') { const c = load(); c.media = c.media.filter(m => m.published && !m.deleted).sort((a,b) => a.order-b.order).map(({ source, ...m }) => m); c.collections = c.collections.filter(m => m.published && !m.deleted); send(200,c); return; }
    if (path === '/api/login' && method === 'POST') {
      const ip = req.socket.remoteAddress || 'unknown'; const now = Date.now(); const attempt = db.prepare('SELECT * FROM attempts WHERE ip=?').get(ip);
      if (attempt && attempt.until > now && attempt.count >= 5) { res.setHeader('Retry-After', String(Math.ceil((attempt.until-now)/1000))); fail(429,'Too many login attempts. Try again in 15 minutes.'); }
      const data = await json(req); const email = text(data.email, 254).toLowerCase(); if (typeof data.password !== 'string' || data.password.length > 512) fail(400,'Invalid password.'); const password = data.password; const user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
      const calculated = scryptSync(password, user?.salt || 'studio-unknown-account',64); const expected = user ? Buffer.from(user.hash,'hex') : Buffer.alloc(64);
      if (!timingSafeEqual(calculated,expected) || !user) { db.prepare('INSERT INTO attempts VALUES (?,?,?) ON CONFLICT(ip) DO UPDATE SET count=excluded.count, until=excluded.until').run(ip, attempt && attempt.until > now ? attempt.count+1 : 1, attempt && attempt.until > now ? attempt.until : now+900000); fail(401,'Email or password is incorrect.'); }
      db.prepare('DELETE FROM attempts WHERE ip=?').run(ip); db.prepare('DELETE FROM sessions WHERE expires<?').run(now); const token = randomBytes(32).toString('hex'); db.prepare('INSERT INTO sessions VALUES (?,?)').run(hashToken(token),now+8*60*60*1000);
      res.setHeader('Set-Cookie',`${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${production ? '; Secure' : ''}`); send(200,{ok:true}); return;
    }
    if (path.startsWith('/api/media/')) { if (!['GET','HEAD'].includes(method)) fail(405,'Method not allowed.'); const name = path.slice(11); if (!/^[a-zA-Z0-9-]+\.(webp|jpg|jpeg|png|mp4)$/.test(name)) fail(404,'File not found.'); const c = load(); const m = c.media.find(m => m.url === path || m.poster === path); if (!m || ((!m.published || m.deleted) && !authenticated(req))) fail(404,'File not found.'); stream(req,res,join(directory,'media',name),true); return; }
    if (path.startsWith('/api/admin') || path === '/api/logout') {
      if (!authenticated(req)) fail(401,'Please sign in to manage the studio.');
      if (path === '/api/logout' && method === 'POST') { const token = req.headers.cookie.split(';').map(p=>p.trim()).find(p=>p.startsWith(cookieName+'=')).slice(cookieName.length+1); db.prepare('DELETE FROM sessions WHERE token=?').run(hashToken(token)); res.setHeader('Set-Cookie',`${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${production ? '; Secure' : ''}`); send(200,{ok:true}); return; }
      if (path === '/api/admin/content' && method === 'GET') { send(200,load()); return; }
      if (path === '/api/admin/upload' && method === 'POST') {
        const kind = new URL(req.url, origin).searchParams.get('kind') === 'film' ? 'film' : 'photo'; const bytes = await body(req,kind === 'film' ? 200*1024*1024 : 10*1024*1024); const mime = req.headers['content-type']; let extension;
        if (mime === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) extension = '.jpg';
        else if (mime === 'image/png' && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension = '.png';
        else if (mime === 'image/webp' && bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP') extension = '.webp';
        else if (kind === 'film' && mime === 'video/mp4' && bytes.toString('ascii',4,8)==='ftyp') extension = '.mp4';
        else fail(400,'The file content does not match a supported format.');
        if ((kind === 'film') !== (extension === '.mp4')) fail(400,'Choose the correct media type.');
        const id = randomUUID(); writeFileSync(join(directory,'media',id+extension),bytes,{flag:'wx'}); const c = load(); const m = { id, kind, title:'Untitled', description:'', alt:'', category:c.categories[0], url:`/api/media/${id}${extension}`, poster:'', orientation:'portrait', featured:false, published:false, deleted:false, order:c.media.length }; c.media.push(m); save(c); send(201,m); return;
      }
      const match = path.match(/^\/api\/admin\/media\/([a-zA-Z0-9-]+)(?:\/(restore|trash|poster|replace))?$/);
      if (match) {
        const c = load(), index = c.media.findIndex(m => m.id === match[1]); if (index < 0) fail(404,'Item not found.'); const m = c.media[index];
        if (method === 'PUT' && !match[2]) { if (m.deleted) fail(400,'Restore this item before editing.'); c.media[index] = mediaFields(await json(req),m); save(c); send(200,c.media[index]); return; }
        if (method === 'POST' && ['restore','trash'].includes(match[2])) { m.deleted = match[2] === 'trash'; m.published = false; save(c); send(200,m); return; }
        if (method === 'DELETE' && !match[2]) { if (!m.deleted) fail(400,'Move this item to Trash first.'); c.media.splice(index,1); save(c); for (const url of [m.url,m.poster]) if (url?.startsWith('/api/media/')) { const path = join(directory,'media',basename(url)); if (existsSync(path)) unlinkSync(path); } send(200,{ok:true}); return; }
        if (method === 'POST' && ['poster','replace'].includes(match[2])) {
          const bytes = await body(req,10*1024*1024); const mime = req.headers['content-type']; let extension;
          if (mime === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) extension='.jpg';
          else if (mime === 'image/png' && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) extension='.png';
          else if (mime === 'image/webp' && bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP') extension='.webp';
          else fail(400,'A valid JPEG, PNG or WebP image is required.');
          if (match[2] === 'replace' && m.kind !== 'photo') fail(400,'Only photographs can be replaced here.');
          const name = randomUUID()+extension; writeFileSync(join(directory,'media',name),bytes); const old = match[2] === 'poster' ? m.poster : m.url; if (match[2] === 'poster') m.poster=`/api/media/${name}`; else m.url=`/api/media/${name}`; save(c); if (old?.startsWith('/api/media/')) { const oldPath = join(directory,'media',basename(old)); if (existsSync(oldPath)) unlinkSync(oldPath); } send(200,m); return;
        }
      }
      if (path === '/api/admin/settings' && method === 'PUT') { const c = load(), data = await json(req); for (const key of Object.keys(c.settings)) if (data[key] !== undefined) c.settings[key]=text(data[key],6000); if (!/^\+?[\d\s]{10,20}$/.test(c.settings.phone)) fail(400,'Enter a valid contact number.'); for (const key of ['instagram','facebook','siteUrl']) if (c.settings[key]) { try { const url = new URL(c.settings[key]); if (url.protocol !== 'https:') throw new Error(); } catch { fail(400,`${key} must be a valid HTTPS URL.`); } } save(c); send(200,c.settings); return; }
      if (path === '/api/admin/categories' && method === 'PUT') { const c = load(), data = await json(req); if (!Array.isArray(data.categories) || !data.categories.length || data.categories.length > 30) fail(400,'Provide 1–30 categories.'); const categories = [...new Set(data.categories.map(s=>text(s,100).toUpperCase()))]; if (categories.some(s=>!s || s==='ALL')) fail(400,'Category names must be nonempty and cannot be ALL.'); if (data.rename) { const from=text(data.rename.from,100), to=text(data.rename.to,100).toUpperCase(); if (!categories.includes(to)) fail(400,'New category is missing.'); c.media.forEach(m=>{if(m.category===from)m.category=to;}); } if (c.media.some(m=>!categories.includes(m.category))) fail(400,'Move all media out of a category before removing it.'); c.categories=categories; save(c); send(200,c.categories); return; }
      if (path === '/api/admin/collections' && method === 'POST') { const c = load(), data=await json(req); const item={id:randomUUID(),title:text(data.title,200),description:text(data.description),published:!!data.published,deleted:false}; if(!item.title)fail(400,'Title is required.'); c.collections.push(item); save(c); send(201,item); return; }
      const collection = path.match(/^\/api\/admin\/collections\/([a-zA-Z0-9-]+)$/); if(collection && method==='PUT'){const c=load(),item=c.collections.find(m=>m.id===collection[1]);if(!item)fail(404,'Collection not found.');const data=await json(req); item.title=text(data.title,200);item.description=text(data.description);if(!item.title)fail(400,'Title is required.');item.published=!!data.published;save(c);send(200,item);return;}
      fail(404,'Action not found.');
    }
    if (path.startsWith('/api/')) fail(404,'Endpoint not found.');
    if (!['GET','HEAD'].includes(method)) fail(405,'Method not allowed.');
    if (path === '/robots.txt') {res.setHeader('Content-Type','text/plain');res.end(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n${load().settings.siteUrl ? `Sitemap: ${load().settings.siteUrl}/sitemap.xml\n` : ''}`);return;}
    if (path === '/sitemap.xml') {const url=load().settings.siteUrl;if(!url)fail(503,'Set the canonical site URL in Website Settings to generate the sitemap.');res.setHeader('Content-Type','application/xml');res.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/our-story','/weddings','/films','/services','/contact'].map(p=>`<url><loc>${url.replace(/\/$/,'').replace(/&/g,'&amp;').replace(/</g,'&lt;')}${p}</loc></url>`).join('')}</urlset>`);return;}
    if (/^\/(videos\/|images\/photo-)/.test(path)) fail(404,'Access media through the published library.');
    const dist=join(root,'dist');const file=resolve(dist,'.'+decodeURIComponent(path));if(!file.startsWith(dist+'/')&&!file.startsWith(dist+'\\')&&file!==dist)fail(403,'Access denied.');const target=existsSync(file)&&statSync(file).isFile()?file:join(dist,'index.html');stream(req,res,target);return;
  } catch(error) { if (!res.headersSent) send(error.status || 500,{error:error.status ? error.message : 'The server could not complete the request.'}); else res.end(); if (!error.status) console.error(error.message); }
});
if (!process.env.STUDIO_TEST) server.listen(Number(process.env.PORT || 3001),process.env.HOST || '127.0.0.1',()=>console.log(`Studio API running at http://localhost:${process.env.PORT || 3001}`));
