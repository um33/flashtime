const router = require('express').Router()
const Deck = require('../models/deck.schema')
const DeckCollection = require('../models/deckCollection.schema')
const User = require('../models/user.schema')
const Card = require('../models/card.schema')
const verifyToken = require('../middlewares/verifyToken')
const validator = require('validator')
const { route } = require('express/lib/application')
const { deleteMany } = require('../models/deck.schema')

router.get('/', verifyToken, async (req, res) => {
  try {
    let decks = await Deck.find({ _id: { $in: req.user.decks } })
      .populate('cards')
      .populate('deckCollection')
    decks = decks.map((deck) => {
      const cardsDue = deck.cards.filter(
        (card) => card.nextRevision < new Date()
      ).length
      const res = { ...deck._doc, cardsDue, links: linksGenerator(deck._id) }
      return res
    })
    res.json(decks)
  } catch (err) {
    res.sendStatus(500)
  }
})

router.get('/:id', verifyToken, async (req, res) => {
  const deckID = req.params.id
  if (!req.user.decks.some((d) => d._id == deckID)) return res.sendStatus(403)
  try {
    let deck = await Deck.findById(deckID)
      .populate('cards')
      .populate('deckCollection')
    const cardsDue = deck.cards.filter(
      (card) => card.nextRevision < new Date()
    ).length
    const finalDeck = {
      ...deck._doc,
      cardsDue,
      links: linksGenerator(deck._id),
    }
    res.json(finalDeck)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.get('/:id/cards', verifyToken, async (req, res) => {
  try {
    const deckId = req.params.id
    await Deck.findById(deckId)
    if (req.user.decks.some((currentDeck) => currentDeck._id == deckId)) {
      const cards = await Card.find({ deck: deckId })
      res.json(cards)
    }
  } catch (err) {
    res.sendStatus(403)
  }
})

router.get('/:id/cards/due', verifyToken, async (req, res) => {
  try {
    const deckId = req.params.id
    await Deck.findById(deckId)
    if (req.user.decks.some((currentDeck) => currentDeck._id == deckId)) {
      const cards = await Card.find({
        deck: deckId,
        nextRevision: { $lte: Date.now() },
      })
      res.json(cards)
    }
  } catch (err) {
    res.sendStatus(403)
  }
})

router.post('/', verifyToken, (req, res) => {
  const deckName = req.body.name
  if (!validator.isLength(deckName, { max: 20 }))
    return res
      .status(400)
      .json({ error: 'Deck name can not be more then 20 character' })
  const newDeck = new Deck({ name: deckName })
  newDeck
    .save()
    .then((deck) => {
      User.findById(req.user._id, (err, user) => {
        if (err) res.sendStatus(403)
        user.decks.push(deck._id)
        user.save().then(() => {
          res.status(201).json(deck)
        })
      })
    })
    .catch((err) => {
      res.json({ message: err })
    })
})

router.post('/:id/cards', verifyToken, async (req, res) => {
  try {
    const front = req.body.front
    const back = req.body.back
    if (
      req.user.decks.some((currentDeck) => currentDeck._id == req.params.id)
    ) {
      const newCard = new Card({
        user: req.user._id,
        deck: req.params.id,
        front: front,
        back: back,
      })
      const deck = await Deck.findById(req.params.id)
      deck.cards.push(newCard._id)
      await deck.save()
      await newCard.save()
      res.status(201).json(newCard)
    } else {
      res.status(403).json('ID is not valid')
    }
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

router.put('/:id', verifyToken, (req, res) => {
  const deckID = req.params.id
  const updateDeckName = req.body.name

  Deck.findById(deckID)
    .then((deck) => {
      if (req.user.decks.some((d) => d._id == deckID)) {
        deck.name = updateDeckName
        return deck.save()
      } else {
        res.sendStatus(403)
      }
    })
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      res.json({ message: err })
    })
})

router.delete('/:id', verifyToken, (req, res) => {
  const deckID = req.params.id
  Deck.findById(deckID)
    .then((deck) => {
      if (req.user.decks.some((d) => d._id == deckID)) {
        deck.delete().then(() => {
          res.status(204).json(`Deck  has been deleted`)
        })
      } else {
        res.json('you are not allowd to delete this deck')
      }
    })
    .catch((err) => {
      res.json({ message: err })
    })
})

router.delete('/', verifyToken, async (req, res) => {
  try {
    const userCollections = req.user.deckCollections.map((c) => c._id)
    await Deck.deleteMany({ _id: { $in: req.user.decks } })
    await DeckCollection.updateMany(
      {
        _id: { $in: userCollections },
      },
      { deck: [] }
    )
    await User.findByIdAndUpdate(req.user._id, { decks: [] })
    res.sendStatus(204)
  } catch (err) {
    res.sendStatus(500)
  }
})

const linksGenerator = (deckId) => {
  const links = [
    {
      rel: 'self',
      href: `/api/decks/${deckId}`,
      type: 'DELETE',
    },
    {
      rel: 'self',
      href: `/api/decks/${deckId}`,
      type: 'PUT',
    },
    {
      rel: 'cards',
      href: `/api/decks/${deckId}/cards`,
      type: 'GET',
    },
    {
      rel: 'cards',
      href: `/api/decks/${deckId}/cards/due`,
      type: 'GET',
    },
  ]
  return links
}

const search = async (req, query) => {
  const decks = await Deck.find({
    _id: { $in: req.user.decks },
    $text: { $search: query },
  })
    .populate('cards')
    .limit(5)
  return decks
}

module.exports = {
  deckController: router,
  deckSearch: search,
}
