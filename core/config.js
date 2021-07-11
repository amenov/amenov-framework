const path = require('path')

module.exports = {
  global: {
    controller: (filename) => (method) => filename + '.' + method,
    pluralize: (number, words, concat) => {
      const result =
        words[
          number % 100 > 4 && number % 100 < 20
            ? 2
            : [2, 0, 1, 1, 1, 2][Math.min(number % 10, 5)]
        ]

      return concat ? number + ' ' + result : result
    },
    env: (envKey, defaultValue) => process.env[envKey] ?? defaultValue ?? null
  },
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
    router: {
      baseUrl: '/',
      routesPath: '/routes',
      apiDocs: {
        title: 'API-docs'
      }
    }
    // extend: () => []
  }
  // start({ config, express, app, server }) {}
}
