const router = require('express').Router()
const DeckCollection = require('../models/deckCollection.schema')
const Deck = require('../models/deck.schema')
const User = require('../models/user.schema')
const verifyToken = require('../middlewares/verifyToken')
const validator = require('validator')
const { collection } = require('../models/deckCollection.schema')

router.get('/', verifyToken, async (req, res) => {
  res.json(
    req.user.deckCollections.map((collection) => ({
      ...collection._doc,
      links: linksGenerator(collection._id),
    }))
  )
})

router.get('/:id', verifyToken, (req, res) => {
  const collectionId = req.params.id
  DeckCollection.findById(collectionId)
    .then((collection) => {
      if (req.user.deckCollections.some((c) => c._id == collectionId)) {
        res.json({ ...collection._doc, links: linksGenerator(collection._id) })
      } else {
        res.sendStatus(403)
      }
    })
    .catch((err) => {
      res.json({ message: err })
      res.sendStatus(404)
    })
})

router.get('/:id/decks', verifyToken, async (req, res) => {
  if (!req.user.deckCollections.some((c) => c._id == req.params.id))
    return res.sendStatus(403)
  try {
    const collectionId = req.params.id
    const collection = await DeckCollection.findById(collectionId).populate(
      'deck'
    )
    res.json(collection.deck)
  } catch (err) {
    res.sendStatus(500)
  }
})

router.get('/:id/decks/:deckId/', verifyToken, async (req, res) => {
  if (!req.user.deckCollections.some((c) => c._id == req.params.id))
    return res.sendStatus(403)

  try {
    const collectionId = req.params.id
    const deckId = req.params.deckId
    const collection = await DeckCollection.findById(collectionId).populate(
      'deck'
    )
    const c = collection.deck.filter((d) => d._id == deckId)
    res.status(200).json(c)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.post('/', verifyToken, async (req, res) => {
  const deckCollectionName = req.body.name
  if (!validator.isLength(deckCollectionName, { max: 20 }))
    return res
      .status(400)
      .json({ error: 'Collection name can not be more than 20 character' })
  const newdeckCollection = new DeckCollection({
    name: deckCollectionName,
  })
  newdeckCollection
    .save()
    .then((deckCollection) => {
      User.findById(req.user._id, (err, user) => {
        if (err) res.sendStatus(403)
        user.deckCollections.push(deckCollection)
        user.save().then(() => {
          res.status(201).json(deckCollection)
        })
      })
    })
    .catch((err) => res.status(404).json('error, ID not found'))
})

router.get('/:id/decks', verifyToken, async (req, res) => {
  if (!req.user.deckCollections.some((c) => c._id == req.params.id))
    return res.sendStatus(403)
  try {
    const collectionId = req.params.id
    const collection = await DeckCollection.findById(collectionId).populate(
      'deck'
    )
    res.json(collection.deck)
  } catch (err) {
    res.sendStatus(500)
  }
})

router.put('/:collectionId/decks/:deckId', verifyToken, async (req, res) => {
  const collectionId = req.params.collectionId
  const deckId = req.params.deckId

  if (
    !req.user.deckCollections.some((c) => c._id == collectionId) ||
    !req.user.decks.some((d) => d._id == deckId)
  ) {
    return res.sendStatus(403)
  }

  try {
    const collection = await DeckCollection.findById(collectionId)
    const deck = await Deck.findById(deckId)
    // deck already exists in the collection
    if (collection.deck.some((d) => d._id == deckId)) {
      return res.sendStatus(400)
    }
    //deck already belongs to another collection
    if (deck.deckCollection) {
      const otherCollection = await DeckCollection.findById(deck.deckCollection)
      otherCollection.deck = otherCollection.deck.filter((d) => d._id != deckId)
      await otherCollection.save()
    }
    collection.deck.push(deck)
    deck.deckCollection = collection._id
    await deck.save()
    await collection.save()
    res.json(collection)
  } catch (err) {
    res.sendStatus(500)
  }
})

router.patch('/:id', verifyToken, async (req, res) => {
  const collectionNameUpdate = req.body.name
  if (!req.user.deckCollections.some((c) => c._id == req.params.id))
    return res.sendStatus(403)
  try {
    const collection = await DeckCollection.findByIdAndUpdate(
      req.params.id,
      { name: collectionNameUpdate },
      { new: true }
    )
    res.json(collection)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.delete('/', verifyToken, async (req, res) => {
  try {
    const userCollections = req.user.deckCollections.map((c) => c._id)
    await DeckCollection.deleteMany({ _id: { $in: userCollections } })
    res.sendStatus(204)
  } catch (err) {
    res.sendStatus(500)
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  const collectionID = req.params.id
  if (!req.user.deckCollections.some((c) => c._id == collectionID))
    return res.sendStatus(403)
  try {
    await DeckCollection.findByIdAndDelete(collectionID)
    res.sendStatus(204)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.get('/:id/decks', verifyToken, async (req, res) => {
  if (!req.user.deckCollections.some((c) => c._id == req.params.id))
    return res.sendStatus(403)
  try {
    const collectionId = req.params.id
    const collection = await DeckCollection.findById(collectionId).populate(
      'deck'
    )
    res.json(collection.deck)
  } catch (err) {
    res.sendStatus(500)
  }
})

router.get('/:collectionId/decks/:deckId', verifyToken, async (req, res) => {
  try {
    const collectionId = req.params.collectionId
    const deckId = req.params.deckId
    const collection = await DeckCollection.findById(collectionId).populate(
      'deck'
    )
    const deck = collection.deck.filter((d) => d._id == deckId)
    res.status(200).json(deck)
  } catch (err) {
    res.status(404).json('what the fuck')
  }
})

router.delete('/:collectionId/decks/:deckId', verifyToken, async (req, res) => {
  try {
    const collectionId = req.params.collectionId
    const deckId = req.params.deckId
    const collection = await DeckCollection.findById(collectionId)
    if (
      req.user.deckCollections.some((c) => c._id == collectionId) &&
      req.user.decks.some((d) => d._id == deckId) &&
      collection.deck.some((d) => d._id == deckId)
    ) {
      collection.deck = collection.deck.filter((d) => d._id != deckId)
      await Deck.findByIdAndUpdate(
        deckId,
        { deckCollection: null },
        { useFindAndModify: false }
      )
      await collection.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(400)
    }
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

const linksGenerator = (collectionId) => {
  const links = [
    {
      rel: 'self',
      href: `/api/collections/${collectionId}`,
      type: 'DELETE',
    },
    {
      rel: 'decks',
      href: `/api/collections/${collectionId}/decks`,
      type: 'GET',
    },
  ]
  return links
}

const search = async (req, query) => {
  const collections = await DeckCollection.find({
    _id: { $in: req.user.deckCollections },
    $text: { $search: query },
  }).limit(5)
  return collections
}

module.exports = {
  collectionController: router,
  collectionSearch: search,
}
