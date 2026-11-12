import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { DatabaseSync } from 'node:sqlite';

// Credentials are read from hidden stdin, never arguments, logs, or source files.
if(process.stdin.isTTY)process.stdin.setRawMode(true);
console.log('Ready for private cloud setup JSON on stdin (input is hidden).');
let input='';
const configuration=await new Promise((done,reject)=>{
  process.stdin.setEncoding('utf8');
  process.stdin.on('data',chunk=>{if(chunk.includes('\u0003'))process.exit(130);input+=chunk;const newline=input.search(/[\r\n]/);if(newline>=0){try{const result=JSON.parse(input.slice(0,newline));input='';process.stdin.pause();if(process.stdin.isTTY)process.stdin.setRawMode(false);done(result);}catch{reject(new Error('Invalid private setup input.'));}}});
});
const db=createClient(configuration.url,configuration.key,{auth:{persistSession:false,autoRefreshToken:false}});
const check=result=>{if(result.error)throw Object.assign(new Error('Supabase operation failed.'),{code:result.error.code||result.error.statusCode});return result.data;};
let client;
try{
  const before=await db.from('studio_content').select('id').limit(1);
  console.log(JSON.stringify({tableReady:!before.error,errorCode:before.error?.code||null}));
  if(configuration.database){
    client=new pg.Client({...configuration.database,database:'postgres',ssl:{rejectUnauthorized:true,...(configuration.caPath?{ca:readFileSync(configuration.caPath,'utf8')}:{})},connectionTimeoutMillis:15000});
    await client.connect();
    await client.query('BEGIN');
    try{await client.query(readFileSync(resolve('server/supabase.sql'),'utf8'));await client.query("NOTIFY pgrst, 'reload schema'");await client.query('COMMIT');}
    catch(error){await client.query('ROLLBACK');throw error;}
    console.log('Studio schema and private media bucket initialized.');
    const local=new DatabaseSync(resolve('.studio/studio.sqlite'));
    try{
      const content=JSON.parse(local.prepare('SELECT json FROM content WHERE id=1').get().json);
      if(configuration.origin)content.settings.siteUrl=configuration.origin;
      await client.query('INSERT INTO public.studio_content (id,data,version) VALUES (1,$1::jsonb,0) ON CONFLICT(id) DO NOTHING',[JSON.stringify(content)]);
      const users=local.prepare('SELECT email,salt,hash FROM users').all();
      if(!users.length)throw new Error('No local administrator exists.');
      for(const user of users)await client.query('INSERT INTO public.studio_users (email,salt,hash) VALUES ($1,$2,$3) ON CONFLICT(email) DO UPDATE SET salt=excluded.salt,hash=excluded.hash',[user.email,user.salt,user.hash]);
      console.log('Existing administrator password hashes migrated; existing cloud content preserved.');
    }finally{local.close();}
    const rows=await client.query("select tablename,rowsecurity from pg_tables where schemaname='public' and tablename like 'studio_%'");
    console.log(JSON.stringify({studioTables:rows.rows.length,allTablesProtected:rows.rows.every(row=>row.rowsecurity)}));
  }
  const content=check(await db.from('studio_content').select('id').eq('id',1));
  const accounts=check(await db.from('studio_users').select('email').limit(5));
  const storage=check(await db.storage.getBucket('studio-media'));
  console.log(JSON.stringify({contentSeeded:content.length===1,adminAccountCount:accounts.length,storagePrivate:storage.public===false}));
}catch(error){console.error(JSON.stringify({setupFailed:true,code:error.code||error.cause?.code||error.name}));process.exitCode=1;}
finally{if(client)await client.end().catch(()=>{});}
