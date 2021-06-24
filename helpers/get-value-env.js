module.exports = (envKey, defaultValue) => {
  return process.env[envKey] ?? defaultValue ?? null
}
