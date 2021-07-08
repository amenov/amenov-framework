const merge = require('merge')
const path = require('path')
const cluster = require('cluster')
const os = require('os')

const server = require('./server')

const config = merge.recursive(
  require(__dirname + '/config'),
  require(path.resolve('config'))
)

if (config.server.multiPocessing && cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`)

    cluster.fork()
  })
} else {
  server(config)
}
