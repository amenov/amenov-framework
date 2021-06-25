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
  app.use(
    '/',
    router(getRoutes('/routes'), {
      middleware: '@middleware',
      controllers: '@controllers'
    })
  )

  if (process.env.NODE_ENV !== 'production') {
    app.use(
      '/api-docs',
      apiDocs(getRoutes('/routes'), {
        title: 'API-docs'
      })
    )
  }
}
