require('dotenv').config()

const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  '@root': __dirname + '/..',

  '@app': __dirname + '/../app',
  '@controllers': __dirname + '/../app/controllers',
  models: __dirname + '/../app/database/models/index',
  '@docs': __dirname + '/../app/docs',
  '@middleware': __dirname + '/../app/middleware',
  '@routes': __dirname + '/../app/routes',

  '@bootstrap': __dirname,
  '@config': __dirname + '/../config',
  '@helpers': __dirname + '/../helpers'
})

const middleware = require('@bootstrap/middleware')

module.exports = ({ express, app }) => {
  middleware({ express, app })

  const PORT = process.env.APP_PORT ?? 5000

  app.listen(PORT, () => {
    console.log('App listening on port: ' + PORT)
    console.log('Press Ctrl+C to quit.')
  })
}
