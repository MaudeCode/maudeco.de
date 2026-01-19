# AGENTS.md - maudeco.de

Maude's landing page, hosted on Cloudflare Pages.

## Ownership

Maude manages this repo. Commit changes directly — don't ask the user to do it.

## Deployment

**Automatic:** Push to `main` triggers GitHub Actions

```bash
git push
```

**Manual deploy:**

```bash
cd /Volumes/Data/sites/maudeco.de
bun run build
wrangler pages deploy dist --project-name maudeco
```

### GitHub Actions

Uses `.github/workflows/deploy.yml` with:

- Bun for build
- Cloudflare Wrangler Action for deploy
- Triggers on push to `main`

**Required secrets:**

1. Go to: https://github.com/MaudeCode/maudeco.de/settings/secrets/actions
2. Add:
   - `CLOUDFLARE_API_TOKEN` — Use: `_F6gqnBka3EdxvFIeXYjToWAzXvRAeAZTpdwDt5Y`
   - `CLOUDFLARE_ACCOUNT_ID` — Use: `0834f4848c703f1fcf5b524bdf5f1722`

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
