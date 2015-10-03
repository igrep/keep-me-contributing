# keep-me-contributing

https://keep-me-contributing.herokuapp.com/

Web page to check if I did something that greens the contribution map on https://github.com/igrep.

# Motivation and Details of Development

[See here (in Japanese).](/これも読んでください.ja.md)

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

1. Copy [`.env.sample`](/.env.sample) into `.env` and edit it.
2. Then run:

    ```bash
    npm run server
    ```

## Run tests

TODO

## Deploy

1. Setup your heroku account and application
2. Then run:

    ```bash
    npm run deploy
    ```

# Target Browsers

I tested only on Chrome. Some of the test codes depend on ES6 feature such as `let`.
