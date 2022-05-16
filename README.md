# Crypto

All the necessary information about each of these is detailed here
see [OpenApi](./src/route/account/account.openapi.yaml) documentation
see [OpenApi](./src/route/account/exchange-rate.openapi.yaml) documentation
see [OpenApi](./src/route/account/movements.openapi.yaml) documentation
Each of these files can be viewed as a swagger-ui instance for clarity (https://swagger.io/).

## Description

This application is based on [NestJs](http://nestjs.com/) framwork

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Configuration

The application is configurable via environment variables. This variables are set by serverless in production environment. Although in develop environment variables have default values this can be overridden

Setting variables

```bash
# env vars
export DB_HOST=0.0.0.0
export DB_PORT=4000
export DB_USERNAME=root
export DB_PASSWORD=admin
export DB_NAME=cryptoDb
```

## Running app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Compile & run app

```bash
$ npm run build
# make sure env vars ares setted correctly
$ node dist/src/main.js
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

#### context-hooks

This suit verify context-hooks correct behaviuor on stress situatios, it pretends to chek consistency on "race conditions" (it is a fact node have not race condition as paralel execution, but in this case, one async trace could get alien context)

### Lint

This project integrates **ESLint** to check syntax and formatting

To collaborate in the project it is highly recommended to use [VSCode](https://code.visualstudio.com)  
There is available a extension that check and notify **ESLint** warnings in runtime:
[**ESLint** by Dirk Baeumer](https://github.com/Microsoft/vscode-eslint) (dbaeumer.vscode-eslint)  
After install the extension it is necessary to allow processing. It will appear a warning in all the .ts files that will help to achieve that.

### do scripts

sudo bash do mysql build

sudo bash do mysql run
