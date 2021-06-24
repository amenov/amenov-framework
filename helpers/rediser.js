const redis = require('amenov.redis')()

const Models = require('models')

module.exports = async (options) => {
  let redisData = JSON.parse(await redis.get(options.redisKey))

  if (!redisData) {
    const Model = Models[options.modelName]

    redisData = await Model[options.modelMethod ?? 'findOne'](
      options.modelOptions ?? {}
    )

    if (redisData) {
      redis.set(options.redisKey, JSON.stringify(redisData))
    }
  }

  return redisData
}
