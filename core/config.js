const path = require('path')

module.exports = {
  global: {},
  server: {
    multiProcessing: false,
    port: process.env.PORT ?? 5000
  },
  moduleAlias: {
    models: __dirname + '/models.js',
    '@root': path.resolve(),
    '@controllers': path.resolve('controllers'),
    '@docs': path.resolve('docs'),
    '@middleware': path.resolve('middleware'),
    '@routes': path.resolve('routes'),
    '@helpers': path.resolve('helpers')
  },
  middleware: {
    rateLimit: {
      windowMs: 5 * 60 * 1000,
      max: 1000
    },
    cors: {},
    validator: {
      locale: 'en'
    },
    router: {
      baseUrl: '/',
      routesPath: '/routes',
      apiDocs: {
        title: 'API-docs'
      }
    }
    // extend: () => []
  }
  // init(config) {},
  // master(config) {},
  // start({ config, express, app, server }) {},
}
