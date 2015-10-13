# keep-me-contributing

https://keep-me-contributing.herokuapp.com/

Web page to check if I did something that greens the contribution map on https://github.com/igrep.

# Motivation and Details of Development

[See here (in Japanese).](/これも読んでください.ja.md)

# Building and Deployment

## Prerequisites

For JavaScript package and clsure compileer installation:

- [npm](https://www.npmjs.com/)

For building and deployment of server application:

- [JDK (8 or later)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Maven](https://maven.apache.org/)
- [foreman](https://rubygems.org/gems/foreman)
- [Heroku Toolbelt](https://rubygems.org/gems/foreman)

For deployment on Android:

- [Apache Cordova](http://cordova.apache.org/)

## Build

```bash
# Install development dependencies
npm install

# Build server (Java) and browser app (JavaScript)
npm run build

# Install dependencies for the app on cordova
cordova platform add android
cordova plugin add de.appplant.cordova.plugin.local-notification@0.8.1

# Build and run cordova app on the connected Android device (JavaScript)
npm run runCordova

# Or only build
npm run cordova
```

## Run locally

1. Then run:

    ```bash
    npm run server
    ```
2. Access to http://localhost:9876/

## Run tests

### Client-side (JavaScript) test on Google Chrome

Access to these URLs after running `npm run server`.

- http://localhost:9876/test/index.html
- http://localhost:9876/test/WorkerTest.html
- http://localhost:9876/test/ServerTest.html
- http://localhost:9876/test/ServerAndNotifierTest.html

### Server-side (Java) test on JUnit

```bash
$ mvn clean install compile test
```

## Deploy

1. Setup your heroku account and application
2. Then run:

    ```bash
    npm run deploy
    ```

# Target Browsers

I tested only on Chrome. Some of the test codes depend on ES6 feature such as `let`.
