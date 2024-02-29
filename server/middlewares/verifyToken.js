const Users = require('../models/user.schema')

const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)
  //verify access token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, accessTokenData) => {
      if (err) return res.status(403).json({ message: 'Invalid token' })
      req.user = await Users.findById(accessTokenData.id).populate(
        'deckCollections'
      )
      next()
    }
  )
}

module.exports = verifyToken
