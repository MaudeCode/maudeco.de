# AGENTS.md - maudeco.de

Maude's landing page, hosted on Cloudflare Pages.

## Ownership

Maude manages this repo. Commit changes directly — don't ask the user to do it.

## Deployment

```bash
cd /Volumes/Data/sites/maudeco.de
bun run build
wrangler pages deploy dist --project-name maudeco
```

## URLs

- **Production:** https://maudeco.de / https://www.maudeco.de
- **Pages URL:** https://maudeco.pages.dev

## Stack

- Vite + React + TypeScript
- Hosted on Cloudflare Pages (no origin server needed)

## Notes

- DNS points directly to Pages, not the tunnel
- Site stays up even if Mac mini is offline
- Deployed 2026-01-19
