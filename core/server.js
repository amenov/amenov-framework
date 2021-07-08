require('dotenv').config()

const moduleAlias = require('module-alias')
const express = require('express')

const { set: setGlobal } = require(__dirname + '/global')
const middleware = require(__dirname + '/middleware')

module.exports = (config) => {
  moduleAlias.addAliases(config.moduleAlias)

  const app = express()

  setGlobal(config.global)
  middleware({ express, app, config })

  const server = app.listen(config.server.port, () => {
    console.log('App listening on port: ' + config.server.port)
    console.log('Press Ctrl+C to quit.')
  })

  config?.start?.({ config, express, app, server })
}
