const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    slug: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
)
module.exports = mongoose.model('topic', topicSchema)
