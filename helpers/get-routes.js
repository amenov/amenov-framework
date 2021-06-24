const fs = require('fs')

module.exports = (path) => {
  const routes = []

  const basePath = __dirname + '/../app'

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

  recursive(path)

  return routes
}
