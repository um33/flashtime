const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.schema')
const Token = require('../models/token.schema')

// consts
const SALT_ROUNDS = 10

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return res.status(401).json({ error: 'Invalid credentials' })
    // if all credentials are valid, create an access and a refresh token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '60m',
      }
    )
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    )
    const encryptedToken = await bcrypt.hash(refreshToken, SALT_ROUNDS)
    const token = await Token.create({ user: user._id, token: encryptedToken })
    token.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    res.status(200).json({ accessToken })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) res.status(401).json({ error: 'Unauthorized' })
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        const tokens = await Token.find({ user: user.id })
        const matchedToken = tokens.filter((t) =>
          bcrypt.compare(refreshToken, t.token)
        )
        if (err || !matchedToken)
          res.status(403).json({ error: 'Token expired' })
        //generate new access token
        const accessToken = jwt.sign(
          { id: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '60m',
          }
        )
        // create and replace new refreshToken
        const newRefreshToken = jwt.sign(
          { id: user.id },
          process.env.REFRESH_TOKEN_SECRET
        )
        const encryptedToken = await bcrypt.hash(newRefreshToken, SALT_ROUNDS)
        const token = await Token.create({
          user: user.id,
          token: encryptedToken,
        })
        await Token.deleteOne({ _id: matchedToken[0]._id })
        await token.save()

        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        res.status(200).json({ accessToken })
      }
    )
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' })
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        try {
          if (err) res.status(403).json({ message: 'Forbidden' })
          const tokens = await Token.find({ user: user.id })
          const matchedToken = tokens.filter((t) =>
            bcrypt.compare(refreshToken, t.token)
          )
          await Token.deleteOne({ _id: matchedToken[0]._id })
          res.clearCookie('refreshToken')
          res.status(200).json({ message: 'Logged out' })
        } catch (error) {
          res.sendStatus(500)
        }
      }
    )
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router
