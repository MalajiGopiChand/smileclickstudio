-- Run once in your Supabase SQL editor. No credentials belong in this file.
create table if not exists public.studio_content (
  id integer primary key check (id=1), data jsonb not null, version bigint not null default 0
);
create table if not exists public.studio_users (
  email text primary key, salt text not null, hash text not null
);
create table if not exists public.studio_sessions (
  token text primary key, expires timestamptz not null
);
create table if not exists public.studio_login_attempts (
  ip text primary key, count integer not null, expires timestamptz not null
);
create table if not exists public.studio_uploads (
  id text primary key, object text not null, type text not null, size bigint not null,
  kind text not null, purpose text not null, item_id text, expires timestamptz not null
);
alter table public.studio_content enable row level security;
alter table public.studio_users enable row level security;
alter table public.studio_sessions enable row level security;
alter table public.studio_login_attempts enable row level security;
alter table public.studio_uploads enable row level security;
revoke all on public.studio_content,public.studio_users,public.studio_sessions,public.studio_login_attempts,public.studio_uploads from anon,authenticated;
grant all on public.studio_content,public.studio_users,public.studio_sessions,public.studio_login_attempts,public.studio_uploads to service_role;
create or replace function public.studio_login_attempt(client_ip text) returns integer language sql security definer set search_path=public as $$
  insert into public.studio_login_attempts as attempts (ip,count,expires)
  values (client_ip,1,now()+interval '15 minutes')
  on conflict(ip) do update set
    count=case when attempts.expires<now() then 1 else attempts.count+1 end,
    expires=case when attempts.expires<now() then now()+interval '15 minutes' else attempts.expires end
  returning count;
$$;
revoke all on function public.studio_login_attempt(text) from public,anon,authenticated;
grant execute on function public.studio_login_attempt(text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('studio-media','studio-media',false,209715200,array['image/jpeg','image/png','image/webp','video/mp4'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
-- No public Storage policies. Media is read using short-lived, server-authorized URLs.
