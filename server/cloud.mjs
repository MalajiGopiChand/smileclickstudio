import { createClient } from '@supabase/supabase-js';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import settings from '../src/studio/settings.json' with { type: 'json' };

export const defaultContent = () => ({ brand:'smile-click-studio', media:[], collections:[], categories:['WEDDINGS','PRE-WEDDINGS','ENGAGEMENTS','HALDI','CANDID MOMENTS','PORTRAITS'], settings:{...settings} });
const bucket = 'studio-media';
const cookieName = '__Host-studio_session';
const tokenHash = value => createHash('sha256').update(value).digest('hex');
const fail = (status, message) => { throw Object.assign(new Error(message),{status}); };
const checked = result => { if(result.error) { console.error('Cloud storage/database operation failed:', result.error.code || result.error.statusCode || 'unknown'); fail(503,'Cloud storage or database is not ready. Complete the Supabase setup in VERCEL_SETUP.md.'); } return result.data; };
export function cloudClient() {
  if(!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) fail(503,'The Vercel admin backend needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Follow VERCEL_SETUP.md, then redeploy.');
  return createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
}
async function load(db) { const row=checked(await db.from('studio_content').select('data,version').eq('id',1).single()); return {data:row.data || defaultContent(),version:row.version}; }
async function mutate(db, action) {
  for(let attempt=0;attempt<4;attempt++) { const row=await load(db); const result=action(row.data); const saved=checked(await db.from('studio_content').update({data:row.data,version:row.version+1}).eq('id',1).eq('version',row.version).select('id')); if(saved.length) return result; }
  fail(409,'Another editor changed this content. Refresh and save again.');
}
function text(value,max=6000) { if(typeof value!=='string'||value.length>max)fail(400,'Invalid text field.'); return value.trim(); }
async function json(request) { if(Number(request.headers.get('content-length')||0)>128*1024)fail(413,'Request is too large.'); const raw=await request.text();if(raw.length>128*1024)fail(413,'Request is too large.');try{return JSON.parse(raw);}catch{fail(400,'Invalid request data.');} }
const cookie = (token,maxAge=28800) => `${cookieName}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
function sessionToken(request) {return request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);}
async function authenticated(db,request) {const token=sessionToken(request);if(!token)return false;const rows=checked(await db.from('studio_sessions').select('token').eq('token',tokenHash(token)).gt('expires',new Date().toISOString()));return rows.length>0;}
function validSignature(bytes,type) {return type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:type==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):type==='image/webp'?bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP':type==='video/mp4'?bytes.toString('ascii',4,8)==='ftyp':false;}
const extensions={'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','video/mp4':'.mp4'};
const filename = url => {const name=url?.split('/').pop();return /^[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp|mp4)$/.test(name||'')?name:null;};
async function authorizeUpload(db,data) {
  const kind=data.kind==='film'?'film':'photo', type=text(data.type,50), size=Number(data.size), purpose=data.purpose||'new';
  if(!extensions[type]||((type==='video/mp4')!==(kind==='film'))||!Number.isInteger(size)||size<=0||size>(kind==='film'?200:10)*1024*1024)fail(400,'Choose a supported file within the upload size limit.');
  if(!['new','poster','replace'].includes(purpose))fail(400,'Invalid upload action.');
  const content=(await load(db)).data;
  if(purpose!=='new'){const item=content.media.find(m=>m.id===data.itemId&&!m.deleted);if(!item||kind!=='photo'||(purpose==='replace'&&item.kind!=='photo'))fail(400,'This file cannot replace that item.');}
  const id=randomUUID(), object=id+extensions[type];
  const upload=checked(await db.storage.from(bucket).createSignedUploadUrl(object));
  checked(await db.from('studio_uploads').insert({id,object,type,size,kind,purpose,item_id:purpose==='new'?null:data.itemId,expires:new Date(Date.now()+2*60*60*1000).toISOString()}));
  return {id,object,token:upload.token,storageUrl:process.env.SUPABASE_URL,bucket,signedUrl:upload.signedUrl};
}
async function completeUpload(db,id) {
  const rows=checked(await db.from('studio_uploads').select('*').eq('id',id).gt('expires',new Date().toISOString()));const upload=rows[0];if(!upload)fail(400,'Upload expired or was already completed.');
  const signed=checked(await db.storage.from(bucket).createSignedUrl(upload.object,60));
  const response=await fetch(signed.signedUrl,{headers:{Range:'bytes=0-15'}});
  if(!response.ok)fail(400,'The uploaded file is unavailable. Please upload it again.');
  const total=Number(response.headers.get('content-range')?.split('/')[1]||response.headers.get('content-length'));
  const reader=response.body.getReader();let bytes=Buffer.alloc(0);try{while(bytes.length<16){const chunk=await reader.read();if(chunk.done)break;bytes=Buffer.concat([bytes,Buffer.from(chunk.value)]);}}finally{await reader.cancel();}
  if(total!==upload.size||!validSignature(bytes,upload.type)){checked(await db.storage.from(bucket).remove([upload.object]));checked(await db.from('studio_uploads').delete().eq('id',id));fail(400,'The uploaded file size or format does not match the selected file.');}
  let obsolete;
  const item=await mutate(db,c=>{if(upload.purpose==='new'){if(c.media.some(m=>m.id===id))return c.media.find(m=>m.id===id);const m={id,kind:upload.kind,title:'Untitled',description:'',alt:'',category:c.categories[0],url:`/api/media/${upload.object}`,poster:'',orientation:'portrait',featured:false,published:false,deleted:false,order:c.media.length};c.media.push(m);return m;}const m=c.media.find(m=>m.id===upload.item_id&&!m.deleted);if(!m)fail(404,'Item not found.');const field=upload.purpose==='poster'?'poster':'url';obsolete=filename(m[field]);m[field]=`/api/media/${upload.object}`;return m;});
  checked(await db.from('studio_uploads').delete().eq('id',id));
  if(obsolete)checked(await db.storage.from(bucket).remove([obsolete]));
  return item;
}
export async function cloudFetch(request, options = {}) {
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer'};
  const reply=(status,data,extra={})=>Response.json(data,{status,headers:{...headers,...extra}});
  try {
    const url=new URL(request.url), path=url.searchParams.get('route') ? '/api/'+url.searchParams.get('route').replace(/^\//,'') : url.pathname;
    const method=request.method, expected=process.env.APP_ORIGIN || (process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:null);
    if(!['GET','HEAD'].includes(method)) { if(!expected)fail(503,'Set APP_ORIGIN to your exact Vercel website URL, then redeploy.'); if(request.headers.get('origin')!==expected.replace(/\/$/,''))fail(403,'Origin not permitted.'); }
    const db=options.db || cloudClient();
    if(path==='/api/content'&&method==='GET'){const c=(await load(db)).data;return reply(200,{...c,media:c.media.filter(m=>m.published&&!m.deleted).sort((a,b)=>a.order-b.order).map(({source,...m})=>m),collections:c.collections.filter(c=>c.published&&!c.deleted),uploadMode:'signed'});}
    if(path==='/api/login'&&method==='POST'){
      const data=await json(request),email=text(data.email,254).toLowerCase();if(typeof data.password!=='string'||data.password.length>512)fail(400,'Invalid password.');
      const ip=request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';const count=checked(await db.rpc('studio_login_attempt',{client_ip:tokenHash(ip)}));if(count>5) return reply(429,{error:'Too many login attempts. Try again in 15 minutes.'},{'Retry-After':'900'});
      const users=checked(await db.from('studio_users').select('salt,hash').eq('email',email));const user=users[0];
      if(!user){scryptSync(data.password,'unknown-studio-account',64);fail(401,'Email or password is incorrect.');}
      if(!timingSafeEqual(scryptSync(data.password,user.salt,64),Buffer.from(user.hash,'hex')))fail(401,'Email or password is incorrect.');
      const token=randomBytes(32).toString('hex');checked(await db.from('studio_sessions').insert({token:tokenHash(token),expires:new Date(Date.now()+28800000).toISOString()}));
      checked(await db.from('studio_login_attempts').delete().eq('ip',tokenHash(ip)));await db.from('studio_sessions').delete().lt('expires',new Date().toISOString());
      return reply(200,{ok:true},{'Set-Cookie':cookie(token)});
    }
    if(path.startsWith('/api/media/')){if(!['GET','HEAD'].includes(method))fail(405,'Method not allowed.');const name=filename(path);if(!name)fail(404,'File not found.');const c=(await load(db)).data,m=c.media.find(m=>m.url===path||m.poster===path);if(!m||((!m.published||m.deleted)&&!await authenticated(db,request)))fail(404,'File not found.');const signed=checked(await db.storage.from(bucket).createSignedUrl(name,60));return new Response(null,{status:307,headers:{...headers,Location:signed.signedUrl}});}
    if(path.startsWith('/api/admin')||path==='/api/logout'){
      if(!await authenticated(db,request))fail(401,'Please sign in to manage the studio.');
      if(path==='/api/logout'&&method==='POST'){checked(await db.from('studio_sessions').delete().eq('token',tokenHash(sessionToken(request))));return reply(200,{ok:true},{'Set-Cookie':cookie('',0)});}
      if(path==='/api/admin/content'&&method==='GET')return reply(200,{...(await load(db)).data,uploadMode:'signed'});
      if(path==='/api/admin/uploads/sign'&&method==='POST')return reply(200,await authorizeUpload(db,await json(request)));
      if(path==='/api/admin/uploads/complete'&&method==='POST')return reply(201,await completeUpload(db,text((await json(request)).id,100)));
      if(path==='/api/admin/settings'&&method==='PUT'){const data=await json(request);return reply(200,await mutate(db,c=>{for(const key of Object.keys(c.settings))if(data[key]!==undefined)c.settings[key]=text(data[key]);if(!/^\+?[\d\s]{10,20}$/.test(c.settings.phone))fail(400,'Enter a valid contact number.');for(const key of ['instagram','facebook','siteUrl'])if(c.settings[key]){let u;try{u=new URL(c.settings[key]);}catch{fail(400,`${key} must be a valid HTTPS URL.`);}if(u.protocol!=='https:')fail(400,`${key} must be a valid HTTPS URL.`);}return c.settings;}));}
      if(path==='/api/admin/categories'&&method==='PUT'){const data=await json(request);return reply(200,await mutate(db,c=>{if(!Array.isArray(data.categories)||!data.categories.length||data.categories.length>30)fail(400,'Provide 1–30 categories.');const categories=[...new Set(data.categories.map(v=>text(v,100).toUpperCase()))];if(categories.some(v=>!v||v==='ALL'))fail(400,'Category names must be nonempty and cannot be ALL.');if(data.rename){const from=text(data.rename.from,100),to=text(data.rename.to,100).toUpperCase();if(!categories.includes(to))fail(400,'New category is missing.');c.media.forEach(m=>{if(m.category===from)m.category=to;});}if(c.media.some(m=>!categories.includes(m.category)))fail(400,'Move all media out of a category before removing it.');c.categories=categories;return categories;}));}
      const match=path.match(/^\/api\/admin\/media\/([a-zA-Z0-9-]+)(?:\/(restore|trash))?$/);
      if(match){const data=method==='PUT'?await json(request):null;let removed=[];const result=await mutate(db,c=>{const index=c.media.findIndex(m=>m.id===match[1]);if(index<0)fail(404,'Item not found.');let m=c.media[index];if(method==='PUT'&&!match[2]){if(m.deleted)fail(400,'Restore this item before editing.');for(const key of ['title','description','alt','category']){m[key]=text(data[key],key==='description'?4000:500);if(!m[key])fail(400,'Title, description, alt text and category are required.');}if(!c.categories.includes(m.category))fail(400,'Choose a valid category.');m.published=!!data.published;m.featured=!!data.featured;m.order=Number.isFinite(Number(data.order))?Number(data.order):0;m.orientation=data.orientation==='landscape'?'landscape':'portrait';return m;}if(method==='POST'&&match[2]){m.deleted=match[2]==='trash';m.published=false;return m;}if(method==='DELETE'&&!match[2]){if(!m.deleted)fail(400,'Move this item to Trash first.');removed=[filename(m.url),filename(m.poster)].filter(Boolean);c.media.splice(index,1);return {ok:true};}fail(405,'Method not allowed.');});if(removed.length)checked(await db.storage.from(bucket).remove(removed));return reply(200,result);}
      if(path==='/api/admin/collections'&&method==='POST'){const data=await json(request);return reply(201,await mutate(db,c=>{const item={id:randomUUID(),title:text(data.title,200),description:text(data.description,4000),published:!!data.published,deleted:false};if(!item.title)fail(400,'Title is required.');c.collections.push(item);return item;}));}
      const collection=path.match(/^\/api\/admin\/collections\/([a-zA-Z0-9-]+)$/);if(collection&&method==='PUT'){const data=await json(request);return reply(200,await mutate(db,c=>{const item=c.collections.find(m=>m.id===collection[1]);if(!item)fail(404,'Collection not found.');item.title=text(data.title,200);item.description=text(data.description,4000);if(!item.title)fail(400,'Title is required.');item.published=!!data.published;return item;}));}
    }
    if(path==='/api/robots'){const site=(await load(db)).data.settings.siteUrl;return new Response(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n${site?`Sitemap: ${site}/sitemap.xml\n`:''}`,{headers:{...headers,'Content-Type':'text/plain'}});}
    if(path==='/api/sitemap'){const site=(await load(db)).data.settings.siteUrl;if(!site)fail(503,'Configure the canonical site URL in Website Settings.');const escaped=site.replace(/\/$/,'').replace(/&/g,'&amp;').replace(/</g,'&lt;');return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/our-story','/photographs','/films','/services','/contact'].map(p=>`<url><loc>${escaped}${p}</loc></url>`).join('')}</urlset>`,{headers:{...headers,'Content-Type':'application/xml'}});}
    fail(404,'Endpoint not found.');
  }catch(error){if(!error.status)console.error('Cloud request failed:',error.name);return reply(error.status||500,{error:error.status?error.message:'The studio server could not complete the request. Please try again.'});}
}
