const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin'
    }
  },
  { timestamps: true }
)

noticeSchema.pre('save', function (next) {
  const currentDate = new Date()

  if (this.date < currentDate) {
    return next(new Error('Date must not be in the past'))
  }

  next()
})

noticeSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()

  if (this._update && this._update.date && this._update.date < currentDate) {
    return next(new Error('Date must not be in the past'))
  }

  next()
})

module.exports = mongoose.model('notice', noticeSchema)
