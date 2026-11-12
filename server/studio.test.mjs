import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';

test('secure studio lifecycle, publication, persistence and authentication', async () => {
  const prefix=join(tmpdir(),'teamcc-test-'), directory=mkdtempSync(prefix), password=randomBytes(24).toString('hex');
  process.env.DATA_DIR=directory;process.env.ADMIN_EMAIL='test@example.invalid';process.env.ADMIN_PASSWORD=password;process.env.APP_ORIGIN='http://localhost:3000';process.env.STUDIO_TEST='1';
  const {server}=await import('./index.mjs'); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;let cookie='';
  const request=async(path,{method='GET',body,origin='http://localhost:3000',type='application/json',auth=true}={})=>{const r=await fetch(base+path,{method,headers:{Origin:origin,...(auth?{Cookie:cookie}:{}),'Content-Type':type},body:body===undefined?undefined:Buffer.isBuffer(body)?body:JSON.stringify(body)});let data;try{data=await r.json();}catch{}return {r,data};};
  try {
    assert.equal((await request('/api/admin/content')).r.status,401);
    assert.equal((await request('/api/login',{method:'POST',body:{email:'test@example.invalid',password:'wrong'}})).r.status,401);
    const login=await request('/api/login',{method:'POST',body:{email:'test@example.invalid',password}});assert.equal(login.r.status,200);const setCookie=login.r.headers.get('set-cookie');assert.match(setCookie,/HttpOnly/);assert.match(setCookie,/SameSite=Strict/);cookie=setCookie.split(';')[0];
    assert.equal((await request('/api/admin/content')).r.status,200);
    assert.equal((await request('/api/admin/settings',{method:'PUT',origin:'http://127.0.0.1:3000',body:{team:''}})).r.status,200);
    assert.equal((await request('/api/admin/settings',{method:'PUT',origin:'http://localhost:3002',body:{team:''}})).r.status,403);
    assert.equal((await request('/api/admin/settings',{method:'PUT',origin:'https://attacker.invalid',body:{team:'not authorized'}})).r.status,403);
    assert.equal((await request('/api/admin/upload',{method:'POST',body:Buffer.from('not an image'),type:'image/png'})).r.status,400);
    assert.equal((await request('/api/admin/upload',{method:'POST',body:Buffer.alloc(10*1024*1024+1),type:'image/png'})).r.status,413);
    const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=','base64');
    const upload=await request('/api/admin/upload',{method:'POST',body:png,type:'image/png'});assert.equal(upload.r.status,201);let media=upload.data;
    assert.equal((await request('/api/content')).data.media.length,0);assert.equal((await fetch(base+media.url)).status,404);
    assert.equal((await fetch(base+media.url,{headers:{Cookie:cookie}})).status,200);
    media={...media,title:'A real moment',alt:'A wedding photograph',description:'A documented celebration',published:true,featured:true};
    assert.equal((await request('/api/admin/media/'+media.id,{method:'PUT',body:media})).r.status,200);
    assert.equal((await request('/api/content')).data.media[0].title,'A real moment');assert.equal((await fetch(base+media.url)).status,200);
    const range=await fetch(base+media.url,{headers:{Range:'bytes=0-7'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,8);
    assert.equal((await request('/api/admin/categories',{method:'PUT',body:{categories:['CEREMONIES','PORTRAITS'],rename:{from:'WEDDINGS',to:'CEREMONIES'}}})).r.status,200);
    assert.equal((await request('/api/content')).data.media[0].category,'CEREMONIES');
    assert.equal((await request('/api/admin/media/'+media.id+'/trash',{method:'POST'})).r.status,200);assert.equal((await fetch(base+media.url)).status,404);
    assert.equal((await request('/api/admin/media/'+media.id+'/restore',{method:'POST'})).data.published,false);assert.equal((await request('/api/content')).data.media.length,0);
    assert.equal((await request('/api/admin/media/'+media.id,{method:'DELETE'})).r.status,400);
    await request('/api/admin/media/'+media.id+'/trash',{method:'POST'});assert.equal((await request('/api/admin/media/'+media.id,{method:'DELETE'})).r.status,200);
    assert.equal((await request('/api/admin/settings',{method:'PUT',body:{history:'Saved studio story',siteUrl:'https://studio.example'}})).r.status,200);
    assert.equal((await request('/api/content')).data.settings.history,'Saved studio story');
    const sitemap=await fetch(base+'/sitemap.xml');assert.equal(sitemap.status,200);const xml=await sitemap.text();assert.match(xml,/https:\/\/studio.example\/films/);assert.match(xml,/https:\/\/studio.example\/photographs/);assert.doesNotMatch(xml,/\/weddings/);
    const oldGallery=await fetch(base+'/weddings?category=portraits',{redirect:'manual'});assert.equal(oldGallery.status,308);assert.equal(oldGallery.headers.get('location'),'/photographs?category=portraits');
    const unpublished=await request('/api/admin/collections',{method:'POST',body:{title:'Private collection',description:'Notes',published:false}});assert.equal(unpublished.r.status,201);assert.equal((await request('/api/content')).data.collections.length,0);
    assert.equal((await request('/api/logout',{method:'POST'})).r.status,200);assert.equal((await request('/api/admin/content')).r.status,401);
    for(let i=0;i<5;i++)assert.equal((await request('/api/login',{method:'POST',body:{email:'test@example.invalid',password:'wrong'}})).r.status,401);
    assert.equal((await request('/api/login',{method:'POST',body:{email:'test@example.invalid',password}})).r.status,429);
    const {DatabaseSync}=await import('node:sqlite');const verification=new DatabaseSync(join(directory,'studio.sqlite'));assert.match(verification.prepare('SELECT json FROM content WHERE id=1').get().json,/Saved studio story/);verification.close();
  }finally{await new Promise(resolve=>server.close(resolve));/* The generated database may remain open until this test process exits on Windows. */ if(resolve(directory).startsWith(resolve(prefix)))try{rmSync(directory,{recursive:true,force:true});}catch{}}
});
