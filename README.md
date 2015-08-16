# keep-me-contributing

Web page to check if I did something that greens the contribution map on https://github.com/igrep.

# Building

```bash
# Install development dependencies
npm install

# Install the other dependencies that depend on packages installed by `npm install`
npm run install

# build (currently in debug mode)
npm run build
```

# Target Browsers

Only Chrome and Chrome for Android so far. Because I'm going to use [Service Worker](https://github.com/slightlyoff/ServiceWorker) API.
