const multer = require('multer')

/*
  options:
    - dist: dir
    - settings: object
      - maxSize: number
      - extensions: string
    - method: string
    - args: array
    - req: object
    - res: object
*/
module.exports = async (options) => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `${__dirname}/../..${options.dist}`)
    },
    filename(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const limits = {
    fileSize: 1024 * 1024 * options.settings.maxSize
  }

  const fileFilter = (req, file, cb) => {
    const regex = new RegExp(
      options.settings.extensions.split('\n').join('|'),
      'i'
    )
    if (file.originalname.match(regex)) {
      cb(null, true)
    } else {
      cb(new Error("I don't have a clue!"))
    }
  }

  const Multer = await multer({ storage, limits, fileFilter })

  const uploader = Multer[options.method](...options.args)

  const promise = new Promise((resolve, reject) => {
    uploader(options.req, options.res, (err) => {
      if (err) {
        reject(err)
      } else {
        let key = 'files'

        if (options.method === 'single') {
          key = 'file'
        }

        resolve(options.req[key])
      }
    })
  })

  return promise
}
