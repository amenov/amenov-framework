const path = require('path')
const fs = require('fs')

const rateLimit = require('express-rate-limit')
const cors = require('cors')
const only = require('amenov.express.only')
const validator = require('amenov.express.validator')
const wherebuilder = require('amenov.express.wherebuilder')
const router = require('amenov.express.router')
const apiDocs = require('amenov.express.api-docs')

const packageJson = require(__dirname + '/../package.json')
const models = require(__dirname + '/models')

module.exports = ({ config, express, app }) => {
  app.get('/', (req, res, next) =>
    res.send(`${packageJson.description} v${packageJson.version}`)
  )

  const middlewareList = [
    express.json(),
    express.urlencoded({ extended: true }),
    ['/storage', express.static(path.resolve('storage'))],
    config.middleware.rateLimit && rateLimit(config.middleware.rateLimit),
    config.middleware.cors && cors(config.middleware.cors),
    only(),
    validator({ sequelize: models.sequelize, ...config.middleware.validator }),
    wherebuilder()
  ]

  if (
    typeof config.middleware.extend === 'function' &&
    Array.isArray(config.middleware.extend()) &&
    config.middleware.extend().length
  ) {
    middlewareList.push(...config.middleware.extend())
  }

  function addRouter(item) {
    const routes = []
    const basePath = path.resolve()

    function fillingRoutes(folder) {
      const files = fs
        .readdirSync(basePath + folder)
        .filter((file) => !file.startsWith('_'))

      for (const file of files) {
        const filePath = folder + '/' + file
        const stat = fs.statSync(basePath + filePath)

        if (stat.isDirectory()) {
          fillingRoutes(filePath)
        } else {
          routes.push(require(basePath + filePath))
        }
      }
    }

    fillingRoutes(item.routesPath)

    middlewareList.push([
      item.baseUrl,
      router(routes, { middleware: '@middleware', controllers: '@controllers' })
    ])

    if (process.env.NODE_ENV !== 'production' && item.apiDocs) {
      middlewareList.push([
        '/docs' + item.baseUrl,
        apiDocs(
          routes,
          Object.assign(item.apiDocs, {
            baseUrl: item.baseUrl === '/' ? '' : item.baseUrl
          })
        )
      ])
    }
  }

  if (Array.isArray(config.middleware.router)) {
    for (const item of config.middleware.router) {
      addRouter(item)
    }
  } else {
    addRouter(config.middleware.router)
  }

  for (const middleware of middlewareList) {
    if (middleware) {
      app.use(...(Array.isArray(middleware) ? middleware : [middleware]))
    }
  }
}
