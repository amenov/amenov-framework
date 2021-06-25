const JWT = require('jsonwebtoken')

const { User } = require('models')

module.exports = async (req, res, next) => {
  const { autorization } = req.headers

  let failed = false

  if (!autorization) failed = true

  if (!failed) {
    try {
      const { userId } = JWT.verify(autorization, process.env.JWT_SECRET_KEY)

      const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: 'password' }
      })

      if (!user) failed = true

      req.me = user

      next()

      console.log('after next()')
    } catch (error) {
      console.log(error)

      failed = true
    }
  }

  return res.status(401).json()
}
