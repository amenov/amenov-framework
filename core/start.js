require('dotenv').config()

const merge = require('merge')
const path = require('path')
const moduleAlias = require('module-alias')
const cluster = require('cluster')
const os = require('os')

const server = require(__dirname + '/server')

// MERGE DEFAULT-CONFIG AND APP-CONFIG
const config = merge.recursive(
  require(__dirname + '/config'),
  require(path.resolve('config'))
)

moduleAlias.addAliases(config.moduleAlias)

// FILLING IN GLOBAL
for (const [key, value] of Object.entries(
  Object.assign(config.global, require(__dirname + '/global'))
)) {
  global['$' + key] = value
}

// RUN INIT
if (typeof config.init === 'function') {
  config.init(config)
}

if (config.server.multiProcessing && cluster.isMaster) {
  // RUN MASTER
  if (typeof config.master === 'function') {
    config.master(config)
  }

  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)

    cluster.fork()
  })
} else {
  // RUN SERVER
  server(config)
}
