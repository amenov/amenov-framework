const path = require('path')
const fs = require('fs')

const rateLimit = require('express-rate-limit')
const cors = require('cors')
const only = require('amenov.express.only')
const validator = require('amenov.express.validator')
const whereBuilder = require('amenov.express.wherebuilder')
const router = require('amenov.express.router')
const apiDocs = require('amenov.express.api-docs')

const packageJson = require(__dirname + '/../package.json')

const models = require(__dirname + '/models')

const getRoutes = (routesPath) => {
  const routes = []

  const basePath = path.resolve()

  const recursive = (folder) => {
    const files = fs
      .readdirSync(basePath + folder)
      .filter((file) => !file.startsWith('_'))

    files.forEach((file) => {
      const filePath = folder + '/' + file

      const stat = fs.statSync(basePath + filePath)

      if (stat.isDirectory()) {
        recursive(filePath)
      } else {
        routes.push(require(basePath + filePath))
      }
    })
  }

  recursive(routesPath)

  return routes
}

module.exports = ({ express, app, config }) => {
  app.get('/', (req, res, next) => {
    res.send(`${packageJson.description} v${packageJson.version}`)
  })

  const middlewareList = [
    express.json(),
    express.urlencoded({ extended: true }),
    ['/storage', express.static(path.resolve('storage'))],
    config.middleware.rateLimit && rateLimit(config.middleware.rateLimit),
    config.middleware.cors && cors(config.middleware.cors),
    only(),
    validator({ sequelize: models.sequelize }),
    whereBuilder()
  ]

  if (
    Array.isArray(config.middleware.extend) &&
    config.middleware.extend()?.length
  ) {
    middleware.push(...config.middleware.extend())
  }

  for (const middleware of middlewareList) {
    if (middleware) {
      app.use(...(Array.isArray(middleware) ? middleware : [middleware]))
    }
  }

  const useRouter = (item) => {
    const routes = getRoutes(item.routesPath)

    app.use(
      item.baseUrl,
      router(routes, { middleware: '@middleware', controllers: '@controllers' })
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

  if (Array.isArray(config.middleware.router)) {
    config.middleware.router.forEach((item) => useRouter(item))
  } else {
    useRouter(config.middleware.router)
  }
}
