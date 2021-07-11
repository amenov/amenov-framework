# The Amenov Framework

## Setup

```sh
npm i -g amenov-framework

amenov-framework init my-project

cd my-project
```

Copy ".env.example" -> ".env" and add your private key to JWT_SECRET_KEY etc.

> Note: Don't forget to set up your database for the next step!

```sh
npx sequelize db:migrate
npx sequelize db:seed:all
```

`npm run dev` or `npm run start`

## Config.js

```javascript
module.exports = {
  global: {
    test: 123
  },
  server: {
    multiProcessing: false, // default
    port: process.env.PORT ?? 5000 // default
  },
  // Add your module aliases so they are always at hand
  moduleAlias: {
    '@utils': __dirname + '/utils'
  },
  middleware: {
    rateLimit: {
      windowMs: 5 * 60 * 1000, // default
      max: 1000 // default
    },
    cors: {}, // default
    router: {
      baseUrl: '/', // default
      routesPath: '/routes', // default
      apiDocs: {
        title: 'API-docs' // default
      }
    }
    // Add your global middleware
    extend: () => [require('@middleware/some'), ...]
  }
  start({ config, express, app, server }) {
    // Will be executed when the application starts
    
    console.log('Hello!', test) // Hello 123
  }
}

```
