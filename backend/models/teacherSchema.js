const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'Teacher'
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true
    },
    teachSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subject'
    },
    teachSclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sclass',
      required: true
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true
        },
        presentCount: {
          type: String
        },
        absentCount: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
)

teacherSchema.pre('save', async function (next) {
  try {
    const existingTeacher = await Teacher.findOne({
      teachSubject: this.teachSubject,
      teachSclass: this.teachSclass
    })

    if (existingTeacher) {
      return next(
        new Error(
          'A teacher is already assigned to teach this subject in this class.'
        )
      )
    }

    next()
  } catch (err) {
    next(err)
  }
})

teacherSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const updatedTeacher = this.getUpdate()

    if (updatedTeacher.teachSubject && updatedTeacher.teachSclass) {
      const existingTeacher = await Teacher.findOne({
        teachSubject: updatedTeacher.teachSubject,
        teachSclass: updatedTeacher.teachSclass
      })

      if (existingTeacher) {
        return next(
          new Error(
            'A teacher is already assigned to teach this subject in this class.'
          )
        )
      }
    }

    next()
  } catch (err) {
    next(err)
  }
})

module.exports = mongoose.model('teacher', teacherSchema)
