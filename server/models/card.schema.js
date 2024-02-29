const mongoose = require('mongoose')
const { Schema } = mongoose

const cardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deck: { type: Schema.Types.ObjectId, ref: 'Deck', required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    repetition: { type: Number, default: 0 },
    interval: { type: Number, default: 0 },
    efactor: { type: Number, default: 2.5 },
    lastRevision: { type: Date, default: Date.now },
    nextRevision: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

const Card = mongoose.model('Card', cardSchema)
module.exports = Card
