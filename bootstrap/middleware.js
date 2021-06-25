const rateLimit = require('express-rate-limit')
const cors = require('cors')

const only = require('amenov.express.only')
const validator = require('amenov.express.validator')
const whereBuilder = require('amenov.express.wherebuilder')
const router = require('amenov.express.router')
const apiDocs = require('amenov.express.api-docs')

const models = require('models')
const configMiddleware = require('@config/middleware')
const getRoutes = require('@helpers/get-routes')

module.exports = ({ express, app }) => {
  app.use(rateLimit(configMiddleware.rateLimit))
  app.use(cors(configMiddleware.cors))

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/storage', express.static(__dirname + '/../storage'))

  app.use(only())
  app.use(validator({ sequelize: models.sequelize }))
  app.use(whereBuilder())

  const useRouter = (item) => {
    const routes = getRoutes(item.routesPath)

    app.use(
      item.baseUrl,
      router(routes, {
        middleware: '@middleware',
        controllers: '@controllers'
      })
    )

    if (process.env.NODE_ENV !== 'production' && item.apiDocs) {
      app.use(
        '/docs' + item.baseUrl,
        apiDocs(
          routes,
          Object.assign(item.apiDocs, {
            baseUrl: item.baseUrl === '/' ? '' : item.baseUrl
          })
        )
      )
    }
  }

  if (Array.isArray(configMiddleware.router)) {
    configMiddleware.router.forEach((item) => useRouter(item))
  } else {
    useRouter(configMiddleware.router)
  }
}
