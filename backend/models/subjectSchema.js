const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema(
  {
    subName: {
      type: String,
      required: true
    },
    subCode: {
      type: String,
      required: true
    },
    sessions: {
      type: String,
      required: true
    },
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sclass',
      required: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin'
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teacher'
    }
  },
  { timestamps: true }
)

subjectSchema.pre('save', async function (next) {
  try {
    const existingSubject = await Subject.findOne({
      subCode: this.subCode,
      sclassName: this.sclassName,
      school: this.school
    })

    if (existingSubject) {
      return next(
        new Error(
          'Môn học này đã tồn tại trong lớp. Mỗi lớp chỉ có một môn học với mã môn này.'
        )
      )
    }

    next()
  } catch (err) {
    next(err)
  }
})

module.exports = mongoose.model('subject', subjectSchema)
