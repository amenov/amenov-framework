require('dotenv').config()

const path = require('path')
const merge = require('merge')
const moduleAlias = require('module-alias')
const express = require('express')

const { set: setGlobal } = require(__dirname + '/global')
const middleware = require(__dirname + '/middleware')

const config = merge.recursive(
  require(__dirname + '/config'),
  require(path.resolve('config'))
)

setGlobal(config.global)

moduleAlias.addAliases(config.moduleAlias)

const app = express()

middleware({ express, app, config })

const server = app.listen(config.server.port, () => {
  console.log('App listening on port: ' + config.server.port)
  console.log('Press Ctrl+C to quit.')
})

config?.start?.({ config, express, app, server })
