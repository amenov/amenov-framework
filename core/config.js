const path = require('path')

module.exports = {
  server: {
    port: process.env.PORT ?? 5000
  },
  middleware: {
    // RATE-LIMIT
    rateLimit: {
      windowMs: 5 * 60 * 1000,
      max: 1000
    },
    // CORS
    cors: {},
    // ROUTER
    router: {
      baseUrl: '/',
      routesPath: '/routes',
      apiDocs: {
        title: 'API-docs'
      }
    },
    moduleAlias: {
      models: __dirname + '/models.js',

      '@root': path.resolve(),

      '@controllers': path.resolve('controllers'),
      '@docs': path.resolve('docs'),
      '@middleware': path.resolve('middleware'),
      '@routes': path.resolve('routes'),
      '@helpers': path.resolve('helpers')
    }
  }
}
