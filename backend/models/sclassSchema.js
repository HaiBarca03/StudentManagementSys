const mongoose = require('mongoose')

const sclassSchema = new mongoose.Schema(
  {
    sclassName: {
      type: String,
      required: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin'
    }
  },
  { timestamps: true }
)

sclassSchema.pre('save', async function (next) {
  try {
    const existingClass = await mongoose.model('sclass').findOne({
      sclassName: this.sclassName,
      school: this.school
    })

    if (existingClass) {
      const error = new Error(
        'Class name must be unique within the same school'
      )
      return next(error)
    }

    next()
  } catch (err) {
    next(err)
  }
})

module.exports = mongoose.model('sclass', sclassSchema)
