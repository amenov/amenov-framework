const moduleAlias = require('module-alias')
const express = require('express')

const middleware = require(__dirname + '/middleware')

module.exports = (config) => {
  moduleAlias.addAliases(config.moduleAlias)

  const app = express()

  for (const [key, value] of Object.entries(
    Object.assign(config.global, require(__dirname + '/global'))
  )) {
    global[key] = value
  }

  middleware({ config, express, app })

  const server = app.listen(config.server.port, () => {
    console.log('App listening on port: ' + config.server.port)
    console.log('Press Ctrl+C to quit.')
  })

  if (typeof config.start === 'function') {
    config.start({ config, express, app, server })
  }
}
