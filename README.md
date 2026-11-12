# Smile Click Studio

React + TypeScript + Vite public website with a Node.js/SQLite content server and private media storage. Uses the original Smile Click Studio identity, Venkatesh’s contact details, Vijayawada address, Instagram, Facebook and original logo. Original project assets and `src/data/` remain intact; the original service data powers the new Services page and enquiry selector.

## Run locally

Requires Node.js 22.14 or newer (uses built-in `node:sqlite`, currently marked experimental by Node 22).

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env` privately. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` with at least 14 characters. There is no built-in/default password. Never put credentials in a `VITE_` variable or commit `.env`.

Start the complete website and API together with one command:

```powershell
npm run dev
```

Open **http://localhost:3000/admin**. Development also accepts the equivalent `http://127.0.0.1:3000` origin. A separate `npm run server` terminal is no longer needed. If a required port is occupied, startup reports the conflict instead of silently switching to a port that cannot log in.

For the built application, run `npm run build` followed by `npm run preview` (or `npm start`). This also serves the website and API together on port 3000. A static Vite-only server does not run the admin backend.

The first server start initializes the administrator account in SQLite. After that, remove `ADMIN_PASSWORD` from `.env`; it is no longer needed. The hashed account persists in the database. Changing the environment value later does not reset an existing password. No password-reset UI is implemented; keep the initial password in your password manager.

## Public experience

- `/`: editorial homepage, adaptive header, featured collection, philosophy, services, films and booking links.
- `/our-story`, `/photographs`, `/films`, `/services`, `/contact` are direct-loadable routes.
- `/photographs` shows all published photos by default, with category filters. Old `/weddings` and `/gallery` links redirect to it.
- Responsive mobile menu with focus trapping and Escape, mobile action bar, keyboard lightbox, touch swipe, gallery filters, reduced-motion support.
- Service enquiries select the relevant contact-form service automatically.
- Contact fields use browser validation and open a URL-encoded WhatsApp draft. Visitors must review and send it. No enquiry is automatically sent or stored.
- Native film controls, muted visible-only autoplay, offscreen/tab-hidden pause, and automatic playback disabled for reduced motion. Manual playback can enable sound. Films should include audio captions/transcripts where needed; this project has no supplied transcripts.

## Brand and photographs

The original logo is displayed without stretching, using `public/images/logo-transparent.png`; the original full logo is retained at `public/images/logo.png`. Original business details: Venkatesh; +91 9502124495; Smileclickstudio950@gmail.com; D.No: 53, Kandrika, N.S.C Bose Nagar, Vijayawada – 15, Andhra Pradesh; Instagram and Facebook: Smile_click_Studio. The tagline is CAPTURE • CREATE • CHERISH. All ten existing services are retained.

The optimized `photo-00.webp` through `photo-35.webp`, original `imgs/`, and specified video files were not present. The homepage uses an abstract background and empty photo frames until real work is published. No stock replacements, fabricated clients or new business details were added.

Upload your real images/MP4 films through Admin, or place the specified assets in their original paths and run:

```powershell
npm run import:assets
```

The importer copies photographs and MP4 files plus matching JPG posters into private storage, preserving originals. Imports start unpublished. It is safe to repeat; original filenames prevent duplicate imports. All category assignments and alt text must be reviewed before publishing. The horizontal `DVSO3edkk0T.mp4` is identified automatically; other films default to vertical.

Do **not** deploy original wedding photos/videos in a public static folder if you expect unpublishing to revoke access. The included Node server denies direct `/images/photo-*` and `/videos/*` access; a separate static host will not. Only protected `/api/media/` URLs enforce publication checks.

## Admin workflow

1. **Upload**: choose Photos (JPEG/PNG/WebP, 10 MB each) or Films (MP4, 200 MB each), select multiple files, review image previews, upload with progress. Uploads start private.
2. **Gallery / Films**: fill title, description, alt text, category and order. Choose Featured and/or Published, then Save. Empty required metadata prevents publishing. Add matching film poster files and set orientation in Films. Photograph replacement is available in Gallery.
3. **Categories**: add, rename or remove categories. Rename updates media assignments. Removal is blocked while items still use the category.
4. **Collections**: create and edit editorial event titles/descriptions and publication status. Collections currently render as editorial text on Photographs; associating specific media with a collection and collection detail routes are not implemented.
5. **Studio Content**: edit homepage introduction, biography/photographer information, history and team. No invented biographies are supplied.
6. **Contact Settings / Website Settings**: phone/WhatsApp, Instagram, Facebook, and canonical HTTPS site URL. Set the site URL for generated canonical links and sitemap.
7. **Trash**: restore as unpublished, or permanently delete after confirmation. Stored copies are removed on permanent deletion; original project files remain intact.
8. **Sign Out** revokes the current server session.

## Persistence and security

SQLite stores account hashes (scrypt with random salt), hashed session tokens, rate-limit state and content. Private media bytes live beside the database in `.studio/media/` by default. Sessions expire after eight hours. Production cookies use Secure, HttpOnly, SameSite=Strict and the `__Host-` prefix. Writes require an exact matching Origin; an external frontend must access the API through a same-origin reverse proxy. No localStorage authentication is used.

Login allows five failed attempts per connection IP per 15-minute window. Behind a proxy, the implementation deliberately uses the direct connection address, so requests can share the rate-limit bucket. Configure trusted proxy-aware client identification at the hosting layer before opening to substantial traffic. Upload format checks verify MIME and file signatures; a production image decoder/optimizer, malware scanner, streaming large-video uploads, adaptive video transcoding, and distributed rate limiting are not included. Uploads are not re-encoded or optimized automatically.

Set `DATA_DIR` to a durable writable volume. Back up both SQLite and its matching media directory using a SQLite-safe backup/snapshot method. A single server instance is supported; do not run multiple replicas against separate volumes. The filesystem is persistent only when the host provides durable storage.

## Verify

```powershell
npm test
npm run build
```

The backend integration suite uses an isolated temporary SQLite database and random disposable credentials. It tests authentication, incorrect credentials, unauthorized access, cross-origin rejection, upload signature/size validation, private/published media access, byte ranges, metadata changes, category rename, Trash, unpublished restore, permanent deletion, settings persistence, sitemap, unpublished collections, logout and rate limiting. Browser checks cover the public desktop/mobile layout and service preselection. Actual wedding images, the ten specified films, sound behavior and poster matching cannot be validated until those files are supplied.

## Production deployment

**No deployment was performed.** This checkout is ready for a production build, but the complete hosted platform still requires a server host with a persistent volume, TLS, administrator setup, real media and a final domain. SQLite/local files do not provide persistent storage inside Vercel serverless functions.

Recommended complete deployment: build with `npm run build`, run `npm run server` behind an HTTPS reverse proxy on a durable Node host. Configure `NODE_ENV=production`, `APP_ORIGIN=https://your-final-domain`, `HOST=0.0.0.0`, `PORT`, `DATA_DIR` and initial administrator credentials. The Node server serves both `dist` and the authenticated API. Set the canonical site URL in Admin. It generates `/robots.txt` and `/sitemap.xml` dynamically.

For **Vercel**, use the included serverless API and Supabase adapter. Follow [VERCEL_SETUP.md](VERCEL_SETUP.md) to run the SQL schema, migrate the local admin hash/content with `npm run cloud:setup`, and configure SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and APP_ORIGIN. The Vercel function handles authentication, content management, rate limiting, protected media and signed direct uploads. Cloud configuration and real-account validation are required before the hosted admin can work. A Git push does not transfer your local SQLite account automatically.

Public metadata includes LocalBusiness data using only supplied facts. SPA pages update titles/descriptions and canonical URLs in the browser; server-rendered per-route metadata, crawlable dynamic OG images and prerendering are not implemented. These should be added before a search/social launch.
