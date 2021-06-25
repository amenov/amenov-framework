const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User } = require('models')

const configAuth = require('@config/auth')

// SIGN-UP
exports.signUp = async (req, res) => {
  const errors = await req.validator({
    email: 'required|string|email|unique:user',
    password: 'required|string',
    passwordConfirm: 'ifExists:password|required|string|as:password'
  })

  if (errors) {
    return res.status(400).json({ errors })
  }

  const data = req.only('email', 'password')

  await User.create(data)

  return res.status(201).json({ success: true })
}

// SIGN-IN
exports.signIn = async (req, res) => {
  const errors = await req.validator({
    email: 'required|string|email|find:user-email',
    password: 'required|string'
  })

  if (errors) {
    return res.status(400).json({ errors })
  }

  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  })

  const passwordMatch = await bcrypt.compare(req.body.password, user.password)

  if (!passwordMatch) {
    return res.status(401).json()
  }

  const access_token = jwt.sign({ userId: user.id }, configAuth.JWT.secretKey, {
    expiresIn: configAuth.JWT.expiresIn
  })

  return res.json({ access_token })
}
