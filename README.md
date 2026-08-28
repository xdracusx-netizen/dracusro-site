# DracusRO — getting the site live

Everything here is free except the domain. Total time from nothing to a working
`dracusro.com` is about forty minutes, most of which is waiting for DNS.

You do not need FTP, a build tool, or a terminal. After the first setup, changing
the site means editing a file in a browser and clicking Commit.

---

## What you are building

```
GitHub repo  ──push──▶  Cloudflare Pages  ──serves──▶  dracusro.com
   (the files)            (free hosting)                (your domain)
```

The repo is the source of truth. Cloudflare watches it and redeploys in about
thirty seconds whenever anything changes. Namecheap only ever points the domain
at Cloudflare and is then done forever.

---

## Step 1 — Buy the domain

Namecheap, or anywhere. `.com` runs around $10–15 a year.

**Turn off everything they upsell.** You do not need their hosting, their email,
their SSL, their site builder, or their "premium DNS". Cloudflare provides
hosting and SSL free and does it better. The only add-on worth keeping is
**WhoisGuard / domain privacy**, which is free at Namecheap and keeps your name
and address out of the public WHOIS record.

Check the name is not already trademarked by Gravity in a way that gets you a
takedown. "DracusRO" is fine — it is your name plus a suffix, not their mark.

---

## Step 2 — Put the files on GitHub

1. Make a free account at github.com if you do not have one.
2. Click **New repository**. Name it `dracusro-site`. Set it **Public**
   (private works too, Cloudflare handles both). Do not add a README — you
   already have files.
3. On the empty repo page, click **uploading an existing file**.
4. Drag in the whole contents of the site folder: `index.html`, the `assets`
   folder, and this README.
5. Click **Commit changes**.

That is the entire deployment. The repo now holds the site.

---

## Step 3 — Connect Cloudflare Pages

1. Free account at cloudflare.com.
2. Left sidebar: **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**.
3. Authorise GitHub, pick `dracusro-site`.
4. Build settings — this is the part people get wrong:

   | Field | Value |
   |---|---|
   | Framework preset | **None** |
   | Build command | *leave completely empty* |
   | Build output directory | `/` |

   The site is plain HTML. There is nothing to build. If you put anything in
   the build command, the deploy fails.

5. **Save and Deploy.**

About a minute later you get a live URL like `dracusro-site.pages.dev`. Open it.
The site is already on the internet at this point — the domain in the next step
is just a nicer name for it.

---

## Step 4 — Point the domain at it

**Add the domain to Cloudflare first:**

1. Cloudflare dashboard → **Add a site** → type `dracusro.com` → pick the
   **Free** plan.
2. Cloudflare scans and shows you two nameservers, something like
   `alice.ns.cloudflare.com` and `bob.ns.cloudflare.com`. Copy both.

**Then tell Namecheap to use them:**

3. Namecheap → **Domain List** → **Manage** next to your domain.
4. **Nameservers** → change the dropdown from *Namecheap BasicDNS* to
   **Custom DNS**.
5. Paste both Cloudflare nameservers. Save with the green tick.

**Then attach the domain to the site:**

6. Back in Cloudflare → **Workers & Pages** → your project → **Custom domains**
   → **Set up a domain** → `dracusro.com`.
7. Repeat for `www.dracusro.com` so both work.

Nameserver changes usually take 10–30 minutes and occasionally a few hours. HTTPS
turns itself on automatically once it resolves — you do not buy or install a
certificate.

---

## Step 5 — Changing the site after launch

**On a computer or a phone, no tools needed:**

1. Open the repo on github.com.
2. Click the file you want to change.
3. Click the pencil icon.
4. Edit, then **Commit changes** at the bottom.
5. Wait about thirty seconds. Refresh the site.

If a change does not appear, hard-refresh: `Ctrl+Shift+R`, or `Cmd+Shift+R` on
Mac. Cloudflare caches aggressively and it is nearly always the cache, not a
broken deploy.

**Every deploy is reversible.** Cloudflare Pages keeps every previous version.
Project → **Deployments** → find a working one → **Rollback**. If you break the
site at 2am you are one click from the version that worked.

---

## File layout

```
index.html          the landing page
assets/style.css    every style on the site
assets/site.js      the territory board
assets/img/         artwork goes here
README.md           this file
```

CSS and JS are shared files, so a colour change or a nav change means editing
one file, not one per page. Keep it that way as pages get added.

To add artwork, drop files into `assets/img/` and reference them as
`assets/img/whatever.jpg`.

---

## Notes for the web developer

The landing page is static. The parts that need a backend are not built yet and
are marked in the markup.

**Registration** — `index.html`, the `#register` section. The form is inert:
`onsubmit="return false"`. It needs to POST to whatever handles account creation.
rAthena stores accounts in the `login` table, and passwords must be hashed the
way the emulator expects, which depends on whether `use_MD5_passwords` is on.

**Territory board** — `assets/site.js`. Ownership is a hardcoded `FACTIONS`
array at the top. Replace it with a `fetch` against an endpoint that reads
`guild_castle` joined to `guild`, returning the same shape. Nothing else in the
file needs to change.

**Ladders** — `#ladders` is static markup. Character and guild rankings come from
the `char` and `guild` tables. City development and bestiary progress come from
custom tables that do not exist yet.

**Shop** — `#shop` is placeholder cards. Cosmetics only, fixed price, no
randomised containers of any kind. That is a product decision, not an oversight.

**FluxCP** is the standard rAthena control panel and already handles accounts,
rankings and a cash shop. Theming it to match this design is likely less work
than building all of it from scratch. It needs PHP and MySQL access to the game
database, which Cloudflare Pages cannot provide — the panel would live on a
separate host or the game server itself, at `panel.dracusro.com`.

---

## If something goes wrong

**Site shows a 404 after deploy.** Build output directory is wrong. It must be
`/` and the build command must be empty.

**Domain does not resolve after an hour.** Check Namecheap actually saved the
nameservers — the green tick has to be clicked, not just the fields filled in.

**Fonts do not load.** The page pulls Cinzel, Spectral and IBM Plex Mono from
Google Fonts. If you ever need the site to work offline or without third-party
requests, download the files into `assets/` and change the `<link>` in
`index.html`.

**Changes are not showing.** Hard-refresh first. Then check the Deployments tab
— if the newest deploy shows a red failure, click it to read the log.
