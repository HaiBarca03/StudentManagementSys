const mongoose = require('mongoose')

const complainSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userRef'
    },
    userType: {
      type: String,
      enum: ['Student', 'Teacher', 'Admin'],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    complaint: {
      type: String,
      required: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true
    }
  },
  { timestamps: true }
)

complainSchema.virtual('userRef').get(function () {
  const typeToCollection = {
    Student: 'student',
    Teacher: 'teacher',
    Admin: 'admin'
  }
  return typeToCollection[this.userType]
})

complainSchema.pre('save', function (next) {
  const currentDate = new Date()

  if (this.date > currentDate) {
    return next(new Error('Date of complaint cannot be in the future'))
  }

  next()
})

module.exports = mongoose.model('complain', complainSchema)
