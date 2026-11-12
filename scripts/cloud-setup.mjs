import { existsSync, readFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { cloudClient, defaultContent } from '../server/cloud.mjs';

if(existsSync('.env'))process.loadEnvFile('.env');
const db=cloudClient();
const check=result=>{if(result.error)throw new Error('Cloud setup failed. Run server/supabase.sql and verify the server-only Supabase environment variables.');return result.data;};
const directory=resolve(process.env.DATA_DIR||'.studio');
if(!existsSync(resolve(directory,'studio.sqlite')))throw new Error('The local administrator database is missing. Initialize the local admin first.');
const local=new DatabaseSync(resolve(directory,'studio.sqlite'));
try{
  const users=local.prepare('SELECT email,salt,hash FROM users').all();if(!users.length)throw new Error('No local administrator exists. Initialize it before cloud setup.');
  const existing=check(await db.from('studio_content').select('id').eq('id',1));
  if(existing.length){console.log('Cloud content already exists; preserving it. Administrator hashes will be synchronized.');}
  else{
    const row=local.prepare('SELECT json FROM content WHERE id=1').get();const content=row?JSON.parse(row.json):defaultContent();
    const types={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4'};
    for(const item of content.media)for(const url of [item.url,item.poster]){if(!url)continue;const name=basename(url);if(!/^[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp|mp4)$/.test(name))throw new Error('Unexpected local media filename.');const path=resolve(directory,'media',name);if(!existsSync(path))throw new Error('A local media file is missing. Repair it before migration.');const extension=name.slice(name.lastIndexOf('.'));check(await db.storage.from('studio-media').upload(name,readFileSync(path),{contentType:types[extension],upsert:true}));}
    check(await db.from('studio_content').insert({id:1,data:content,version:0}));
  }
  check(await db.from('studio_users').upsert(users,{onConflict:'email'}));
  console.log('Cloud setup complete. Persistent content, private media, and administrator password hashes were transferred. No plaintext passwords were uploaded.');
}finally{local.close();}
