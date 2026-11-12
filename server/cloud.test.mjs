import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes,scryptSync } from 'node:crypto';
import { cloudFetch,defaultContent } from './cloud.mjs';

// Contract double for PostgreSQL/Storage. Production account access is tested separately.
class Query {
  constructor(db,table){this.db=db;this.table=table;this.filters=[];this.operation='select';}
  select(){return this;}
  eq(key,value){this.filters.push(row=>row[key]===value);return this;}
  gt(key,value){this.filters.push(row=>row[key]>value);return this;}
  lt(key,value){this.filters.push(row=>row[key]<value);return this;}
  insert(data){this.operation='insert';this.data=Array.isArray(data)?data:[data];return this;}
  update(data){this.operation='update';this.data=data;return this;}
  delete(){this.operation='delete';return this;}
  single(){this.one=true;return this;}
  then(done,reject){try{const rows=this.db.tables[this.table] ||= [];let found=rows.filter(row=>this.filters.every(f=>f(row)));if(this.operation==='insert'){rows.push(...structuredClone(this.data));found=this.data;}if(this.operation==='update'){for(const row of found)Object.assign(row,structuredClone(this.data));}if(this.operation==='delete')this.db.tables[this.table]=rows.filter(row=>!found.includes(row));return Promise.resolve({data:structuredClone(this.one?found[0]:found),error:null}).then(done,reject);}catch(e){return Promise.reject(e).then(done,reject);}}
}
class CloudDouble {
  constructor(user){this.tables={studio_content:[{id:1,data:defaultContent(),version:0}],studio_users:[user],studio_sessions:[],studio_login_attempts:[],studio_uploads:[]};this.storage={from:()=>({createSignedUploadUrl:async name=>({data:{signedUrl:`https://storage.example/upload/${name}`,token:'object-scoped-test-token'},error:null}),createSignedUrl:async name=>({data:{signedUrl:`https://storage.example/download/${name}`},error:null}),remove:async()=>({data:[],error:null})})};}
  from(table){return new Query(this,table);}
  async rpc(name,{client_ip}){let row=this.tables.studio_login_attempts.find(r=>r.ip===client_ip);if(!row){row={ip:client_ip,count:0};this.tables.studio_login_attempts.push(row);}return {data:++row.count,error:null};}
}
test('Vercel handler: login, session, publish, private uploads, persistence contracts',async t=>{
  process.env.APP_ORIGIN='https://studio.example';const password=randomBytes(24).toString('hex'),salt=randomBytes(32).toString('hex');const db=new CloudDouble({email:'admin@example.invalid',salt,hash:scryptSync(password,salt,64).toString('hex')});let cookie='';
  const request=async(path,method='GET',body,origin='https://studio.example',useCookie=true)=>{const response=await cloudFetch(new Request('https://studio.example'+path,{method,headers:{Origin:origin,...(useCookie?{Cookie:cookie}:{}),'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),{db});let data;try{data=await response.clone().json();}catch{}return {response,data};};
  assert.equal((await request('/api/admin/content')).response.status,401);
  assert.equal((await request('/api/login','POST',{email:'admin@example.invalid',password},'https://attacker.invalid')).response.status,403);
  const login=await request('/api/studio?route=login','POST',{email:'admin@example.invalid',password});assert.equal(login.response.status,200);assert.match(login.response.headers.get('set-cookie'),/Secure; SameSite=Strict/);cookie=login.response.headers.get('set-cookie').split(';')[0];
  assert.equal((await request('/api/admin/content')).data.uploadMode,'signed');
  assert.equal((await request('/api/admin/uploads/sign','POST',{kind:'photo',type:'image/png',size:11*1024*1024})).response.status,400);
  const signed=await request('/api/admin/uploads/sign','POST',{kind:'photo',type:'image/png',size:68});assert.equal(signed.response.status,200);assert.match(signed.data.signedUrl,/storage.example\/upload/);
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=','base64');db.tables.studio_uploads[0].size=png.length;
  t.mock.method(globalThis,'fetch',async()=>new Response(png.subarray(0,16),{status:206,headers:{'Content-Range':`bytes 0-15/${png.length}`}}));
  const complete=await request('/api/admin/uploads/complete','POST',{id:signed.data.id});assert.equal(complete.response.status,201);const media=complete.data;
  assert.equal((await request('/api/content')).data.media.length,0);assert.equal((await request(media.url,'GET',undefined,'https://studio.example',false)).response.status,404);
  const published={...media,title:'Wedding moment',description:'A real celebration',alt:'A photograph from the celebration',published:true,featured:true};assert.equal((await request('/api/admin/media/'+media.id,'PUT',published)).response.status,200);
  assert.equal((await request('/api/content')).data.media.length,1);assert.equal((await request(media.url,'GET',undefined,'https://studio.example',false)).response.status,307);
  await request('/api/admin/media/'+media.id+'/trash','POST');assert.equal((await request('/api/content')).data.media.length,0);
  assert.equal((await request('/api/admin/media/'+media.id+'/restore','POST')).data.published,false);
  assert.equal((await request('/api/admin/settings','PUT',{history:'Persistent studio story'})).response.status,200);assert.equal((await request('/api/content')).data.settings.history,'Persistent studio story');
  await request('/api/logout','POST');assert.equal((await request('/api/admin/content')).response.status,401);
  for(let i=0;i<5;i++)assert.equal((await request('/api/login','POST',{email:'admin@example.invalid',password:'wrong'})).response.status,401);
  assert.equal((await request('/api/login','POST',{email:'admin@example.invalid',password})).response.status,429);
});
test('Vercel handler reports missing configuration without exposing credentials',async()=>{delete process.env.SUPABASE_URL;delete process.env.SUPABASE_SERVICE_ROLE_KEY;const response=await cloudFetch(new Request('https://studio.example/api/admin/content'));assert.equal(response.status,503);assert.match((await response.json()).error,/SUPABASE_URL/);});
