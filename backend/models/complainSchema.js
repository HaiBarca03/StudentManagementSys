const mongoose = require('mongoose')

const complainSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userRef'
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

complainSchema.pre('save', async function (next) {
  if (!this.user) return next()

  const Student = mongoose.model('student')
  const Teacher = mongoose.model('teacher')
  const Admin = mongoose.model('admin')

  const isStudent = await Student.exists({ _id: this.user })
  if (isStudent) {
    this.userRef = 'student'
    return next()
  }

  const isTeacher = await Teacher.exists({ _id: this.user })
  if (isTeacher) {
    this.userRef = 'teacher'
    return next()
  }

  const isAdmin = await Admin.exists({ _id: this.user })
  if (isAdmin) {
    this.userRef = 'admin'
    return next()
  }

  return next(new Error('User không tồn tại trong bất kỳ collection nào'))
})

module.exports = mongoose.model('complain', complainSchema)
