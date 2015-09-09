# keep-me-contributing

https://keep-me-contributing.herokuapp.com/

Web page to check if I did something that greens the contribution map on https://github.com/igrep.

# Building and Deployment

## Prerequisites

- [npm](https://www.npmjs.com/)
- [JDK (8 or later)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Maven](https://maven.apache.org/)
- [foreman](https://rubygems.org/gems/foreman)
- [Heroku Toolbelt](https://rubygems.org/gems/foreman)

## Build

```bash
# Install development dependencies
npm install

# Build (currently in debug mode)
npm run build
```

## Run locally

1. Copy and edit [.env](/.env.sample).

```bash
npm run server
```

## Run tests

TODO

## Deploy

1. Setup your heroku account and application

```bash
npm run deploy
```

# Target Browsers

Only Chrome and Chrome for Android so far. Because I'm going to use [Service Worker](https://github.com/slightlyoff/ServiceWorker) API.
