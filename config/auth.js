module.exports = {
  JWT: {
    secretKey: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN
  }
}
