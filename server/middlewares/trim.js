const validator = require('validator')

const trim = (req, res, next) => {
  const body = req.body
  for (const key in body) {
    if (typeof body[key] === 'string') {
      body[key] = validator.trim(body[key])
    }
  }
  next()
}

module.exports = trim
