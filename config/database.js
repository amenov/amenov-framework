require('dotenv').config()

const getValueEnv = require('@helpers/get-value-env')

const getConnectionConfig = (mode) => ({
  [mode]: {
    dialect: getValueEnv('DB_DIALECT', 'mysql'),
    host: getValueEnv('DB_HOST', '127.0.0.1'),
    port: getValueEnv('DB_PORT', '3306'),
    database: getValueEnv('DB_NAME', 'database_' + mode),
    username: getValueEnv('DB_USERNAME', 'root'),
    password: getValueEnv('DB_PASSWORD', 'password_' + mode),
    logging: eval(getValueEnv('DB_LOGGING', true))
  }
})

module.exports = {
  ...getConnectionConfig('development'),
  ...getConnectionConfig('test'),
  ...getConnectionConfig('production')
}
