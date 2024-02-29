const mongoose = require('mongoose')
const { Schema } = mongoose

const deckSchema = new Schema(
  {
    name: { type: String, required: true },
    deckCollection: { type: Schema.Types.ObjectId, ref: 'DeckCollection' },
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  },
  { timestamps: true }
)

deckSchema.index({ '$**': 'text' })
module.exports = mongoose.model('Deck', deckSchema)
