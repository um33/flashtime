const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user.schema')
const Deck = require('../models/deck.schema')
const Card = require('../models/card.schema')
const Token = require('../models/token.schema')
const DeckCollection = require('../models/deckCollection.schema')
const verifyToken = require('../middlewares/verifyToken')
const validator = require('validator')

// consts
const SALT_ROUNDS = 10

router.get('/', verifyToken, (req, res) => {
  const { firstName, lastName, email, decks, deckCollections } = req.user
  res.json({
    firstName,
    lastName,
    email,
    decks,
    deckCollections,
  })
})

router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password: pass,
      confirmPassword,
    } = req.body

    const existingUsers = await User.find({ email })
    // input validation
    const errors = []
    if (existingUsers.length > 0) errors.push('Email is already taken')
    if (!validator.isEmail(email)) errors.push('Email is not valid')
    if (!validator.isLength(pass, { min: 8 }))
      errors.push('Passoword must be at least 8 characters')
    if (pass !== confirmPassword) errors.push('Passwords do not match')
    if (errors.length > 0) return res.status(400).json({ errors: errors })

    const password = await bcrypt.hash(req.body.password, SALT_ROUNDS)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    })
    await user.save()
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ errors: [err.message] })
  }
})

router.put('/', verifyToken, async (req, res) => {
  const userId = req.user._id
  const firstNameUpdate = req.body.firstName
  const lastNameUpdate = req.body.lastName
  const emailUpdate = req.body.email
  try {
    const userInfo = await User.findByIdAndUpdate(
      userId,
      {
        firstName: firstNameUpdate,
        lastName: lastNameUpdate,
        email: emailUpdate,
      },
      { new: true }
    )
    const updatedUser = await userInfo.save()
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.patch('/password', verifyToken, async (req, res) => {
  const userId = req.user._id
  const currentPassword = req.body.currentPassword

  if (!validator.isLength(req.body.newPassword, { min: 8 }))
    return res
      .status(400)
      .json({ error: 'Password must be at least 8 characters' })

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    req.user.password
  )

  if (!isPasswordValid)
    return res.status(403).json({ error: 'Invalid credentials' })
  const passwordUpdate = await bcrypt.hash(req.body.newPassword, SALT_ROUNDS)

  User.findById(userId)
    .then((userInfo) => {
      userInfo.password = passwordUpdate
      return userInfo.save()
    })
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      res.json({ error: 'Something went wrong' })
    })
})

router.delete('/', verifyToken, async (req, res) => {
  const userId = req.user._id
  const userCollections = req.user.deckCollections.map((c) => c._id)
  const userDecks = req.user.decks.map((d) => d._id)
  try {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      req.user.password
    )
    if (!isPasswordValid)
      return res.status(401).json({ error: 'Invalid credentials' })
  } catch (cc) {
    res.sendStatus(400)
  }
  try {
    await User.findByIdAndDelete(userId)
    await DeckCollection.deleteMany({ _id: { $in: userCollections } })
    await Deck.deleteMany({ _id: { $in: userDecks } })
    await Card.deleteMany({ user: req.user._id })
    await Token.deleteMany({ user: req.user._id })
    res.sendStatus(204)
  } catch (err) {
    res.sendStatus(500)
  }
})

module.exports = router
