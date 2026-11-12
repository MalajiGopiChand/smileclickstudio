# Smile Click Studio on Vercel

The Vercel API lives in `api/studio.js`. It uses Supabase PostgreSQL for persistent content, password hashes, sessions and rate limiting, and a private Storage bucket for photographs/films. It does not use Vercel's temporary filesystem. The SQLite server remains available for local development.

## One-time cloud setup

1. Create a Supabase project in your own account. Open its SQL editor and run [server/supabase.sql](server/supabase.sql). This creates private tables and a private `studio-media` bucket. No anonymous or signed-in browser role can read the database tables directly.
2. In your local ignored `.env`, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from that project. Keep the key private; do not prefix it with `VITE_` and do not paste it into chat or commit it.
3. Run `npm run cloud:setup` on this computer. It transfers your existing administrator's **password hash**, content, and private media from `.studio` to Supabase. Your current admin email/password keep working. No plaintext password is transferred. Existing cloud content is preserved on subsequent runs; only administrator hashes are synchronized. Sessions are not migrated.
4. Open the Vercel project linked to `MalajiGopiChand/smileclickstudio`. Select the Vite framework, `npm run build`, and output directory `dist`. Use Node.js 22 or newer.
5. Add these **server-side** Vercel environment variables for Production:

   - `SUPABASE_URL`: your project's HTTPS URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: the project's private service-role key.
   - `APP_ORIGIN`: the exact HTTPS website origin, for example `https://your-project.vercel.app`, with no path or trailing slash.

6. Redeploy after configuring the variables. Open `/admin`, sign in with your existing credentials, and check Gallery, Upload, Settings and Sign Out.
7. Set the final public URL in Website Settings to generate canonical links and the sitemap. If you use a custom domain, set `APP_ORIGIN` to that domain and redeploy. Production writes intentionally reject other origins. Set the appropriate APP_ORIGIN separately for any preview deployment you want to use.

The local administrator account is not committed to GitHub. A Git push alone cannot migrate `.studio` or configure your cloud credentials. Until the SQL, migration, environment variables and redeployment are complete, the admin page shows an explicit cloud-setup error.

For assisted initialization, `scripts/cloud-init.mjs` accepts a private JSON configuration through hidden standard input. It can apply the schema over a PostgreSQL connection with certificate and hostname validation, seed missing content, and transfer the local admin hashes. Supply the database CA certificate through `caPath`. It preserves existing cloud content and reports only nonsecret setup status. Never put connection credentials in command arguments or committed configuration files.

## Uploads and private media

Large files upload directly to Supabase using short-lived, object-scoped upload URLs, avoiding Vercel's request-body limit. Photographs are limited to 10 MB; MP4 films to 200 MB. After uploading, the server checks the stored file size and signature before adding it to the library. All items start unpublished. Posters and replacements use the same signed-upload flow. Pending interrupted uploads are private and can be removed from the Supabase dashboard.

The `/api/media/` route checks publication or an active admin session, then redirects to a private signed download URL valid for 60 seconds. Previously issued URLs remain usable for up to 60 seconds after unpublishing. Never make the bucket public. Auth uses scrypt hashes and opaque eight-hour Secure/HttpOnly/SameSite cookies. Logout deletes the server session immediately. Five login attempts per IP are allowed in each 15-minute window.

Schema and server code support compare-and-swap content saves so simultaneous edits retry instead of silently overwriting each other's changes. This is a small-studio content model; it stores content metadata as one versioned PostgreSQL JSON document.

## Local commands

```powershell
npm run dev
```

Starts the Vite site and SQLite API together at `http://localhost:3000`.

```powershell
npm run build
npm run preview
```

Serves the built site and SQLite API together on port 3000. Local credentials and uploads remain separate from Supabase until you run `npm run cloud:setup`. The development server accepts both localhost and 127.0.0.1 on the configured port; production requires the exact APP_ORIGIN.

## Validation limits

Local backend integration tests and cloud-handler contract tests run without a real Supabase account. Complete the production login/upload/publish/restore checks against your actual Supabase project after configuration. A successful frontend build does not verify cloud account access or an active Vercel deployment.

## References

- [Vercel Functions](https://vercel.com/docs/functions)
- [Vercel function limits](https://vercel.com/docs/functions/limitations)
- [Supabase signed uploads](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl)
- [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api)
