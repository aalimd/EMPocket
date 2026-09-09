# EM-CPs: free main application

- This directory is the independent, free EM Pocket application.
- EM-P is a separate paid sibling. Do not modify that sibling while working on this application unless explicitly instructed.
- Keep the free runtime self-contained: local clinical data and scripts, no account requirement, subscription gate or paid API/content dependency.
- Preserve existing free progress and preference keys. Never read, migrate, clear or write paid `em-p-` keys.
- Keep PWA URLs relative and service-worker fetch/cache cleanup limited to this installation. Never clear all same-origin caches or unregister other applications' workers.
- When changing shipped assets, update release query strings and service-worker cache revision together.
- Run `node --test tests/*.test.js` and appropriate local browser checks for UI changes. Do not claim live deployment or physical-device testing without evidence.
