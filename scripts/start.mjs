import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
process.chdir(root);
if (existsSync(resolve(root, '.env'))) process.loadEnvFile(resolve(root, '.env'));
const preview = process.argv.includes('--preview');
const webPort = Number(process.env.WEB_PORT || 3000);
const apiPort = preview ? webPort : Number(process.env.PORT || 3001);
process.env.APP_ORIGIN ||= `http://localhost:${webPort}`;
// Own both listeners here so startup errors and shutdown affect the whole app.
process.env.STUDIO_TEST = '1';
const { server } = await import('../server/index.mjs');
delete process.env.STUDIO_TEST;
let vite;
const close = async () => { await vite?.close(); server.closeAllConnections(); await new Promise(done => server.close(done)); };
try {
  if (preview && !existsSync(resolve(root, 'dist/index.html'))) throw new Error('Run npm run build before starting the production preview.');
  await new Promise((done, reject) => { server.once('error', reject); server.listen(apiPort, '127.0.0.1', () => { server.removeListener('error', reject); done(); }); });
  if (!preview) {
    const { createServer } = await import('vite');
    vite = await createServer({ root, server: { host: '127.0.0.1', port: webPort, strictPort: true, proxy: { '/api': `http://127.0.0.1:${apiPort}` } } });
    await vite.listen();
  }
  console.log(`Smile Click Studio: http://localhost:${webPort}`);
  console.log(`Admin login: http://localhost:${webPort}/admin`);
  console.log('Website and content server are running together. Press Ctrl+C to stop.');
  let stopping = false;
  for (const signal of ['SIGINT','SIGTERM']) process.on(signal, async () => { if(stopping)return;stopping=true;await close();process.exit(0); });
} catch(error) {
  console.error(error.code === 'EADDRINUSE' ? `Port ${apiPort} or ${webPort} is already in use. Stop the previous studio server, then run this command again.` : error.message);
  await close(); process.exit(1);
}
