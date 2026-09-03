# EM-CPs deployment

This is a self-contained static PWA: there is no build step, database, PHP runtime, or environment file.

ECG guide (route `#ecg`): programmer notes, SVG/image inventory, and clinical caveats are in [docs/ECG-SECTION.md](docs/ECG-SECTION.md). Read that before changing drawings or ACS wording.

## Hostinger deployment

1. In hPanel, open **Websites → Manage → File Manager** and open the target site's `public_html` directory (or the subdirectory used by the intended subdomain).
2. Upload the complete contents of this folder, including the hidden [`.htaccess`](.htaccess) file and the full `assets` directory. `index.html` must sit directly in that web root.
3. Enable SSL / **Force HTTPS** in hPanel before testing. Service workers and installable PWAs require HTTPS in production.
4. If Hostinger caching is enabled, flush it once after upload. Then test the site in a private window, including a direct presentation link such as `https://your-domain.example/#dyspnea`.

The release token `20260903-1` is present in the HTML, manifest, and service-worker URLs to bypass Hostinger's asset cache after a deployment. When changing any app asset, update that token everywhere it appears and increment `CACHE_VERSION` (currently `v34`) in `sw.js` so installed copies receive the new offline bundle promptly. Cache names include the service-worker scope, preventing parallel deployments on one origin from deleting each other's offline data.

## Release checklist

- Open the root page and one direct hash link.
- Check search, the severity chips, a red-flag checklist, theme controls, and Export PDF.
- In browser DevTools, confirm `manifest.json` and `sw.js` return HTTP 200 with no console errors.
- Disconnect briefly after the first successful load and refresh once to confirm the offline shell.
