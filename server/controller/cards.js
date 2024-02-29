const router = require('express').Router()
const Card = require('../models/card.schema')
const Deck = require('../models/deck.schema')
const { supermemo } = require('supermemo')
const dayjs = require('dayjs')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', verifyToken, (req, res) => {
  Card.find({ user: req.user._id })
    .then((cards) => {
      if (cards.length === 0) res.json('You do not have any card yet')
      res.json(
        cards.map((card) => ({ ...card._doc, links: linksGenerator(card._id) }))
      )
    })
    .catch((err) => {
      res.sendStatus(404)
    })
})

router.get('/due', verifyToken, async (req, res) => {
  try {
    const cards = await Card.find({
      user: req.user._id,
      nextRevision: { $lte: Date.now() },
    })
    res.json(
      cards.map((card) => ({ ...card._doc, links: linksGenerator(card._id) }))
    )
  } catch (err) {
    res.sendStatus(500)
  }
})

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const card = await Card.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('deck')
    res.json({ ...card._doc, links: linksGenerator(card._id) })
  } catch (err) {
    res.status(400).json({ message: 'Wrong ID' })
  }
})

router.patch('/:id', verifyToken, async (req, res) => {
  if (req.body.hasOwnProperty('deckID'))
    res.status(400).json({ message: 'ID cannot be change' })
  Card.findByIdAndUpdate(req.params.id, req.body)
    .then((updatedCard, err) => {
      if (err) res.sendStatus(404)
      res.json(updatedCard)
    })
    .catch((err) => res.sendStatus(500))
})

router.patch('/:id/revise', verifyToken, async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, user: req.user._id })
    const { interval, repetition, efactor } = supermemo(card, req.body.grade)
    const nextRevision = dayjs().add(interval, 'day').toISOString()
    const lastRevision = dayjs().toISOString()
    const updated = await Card.findByIdAndUpdate(
      req.params.id,
      {
        interval,
        repetition,
        efactor,
        nextRevision,
        lastRevision,
      },
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.sendStatus(500)
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, user: req.user._id })
    if (!card) return res.status(403).json({ message: 'Wrong ID' })
    const deck = await Deck.findById(card.deck)
    if (!req.user.decks.some((d) => d._id.toString() === card.deck.toString()))
      return res.status(403).json({ message: 'Invalid Deck' })
    deck.cards = deck.cards.filter(
      (c) => c._id.toString() != card._id.toString()
    )
    await Card.findByIdAndDelete(req.params.id)
    await deck.save()
    res.sendStatus(204)
  } catch (err) {
    res.sendStatus(500)
  }
})

const linksGenerator = (cardId) => {
  const links = [
    {
      rel: 'self',
      href: `/api/cards/${cardId}`,
      type: 'DELETE',
    },
    {
      rel: 'self',
      href: `/api/cards/${cardId}`,
      type: 'PATCH',
    },
  ]
  return links
}

module.exports = router
