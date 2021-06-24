const getValueEnv = require('@helpers/get-value-env')

module.exports = {
  JWT: {
    expiresIn: getValueEnv('JWT_EXPIRES_IN'),
    secretKey: getValueEnv('JWT_SECRET_KEY')
  }
}
