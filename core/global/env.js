module.exports = (envKey, defaultValue) =>
  process.env[envKey] ?? defaultValue ?? null
