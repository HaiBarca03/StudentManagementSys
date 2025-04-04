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
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
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
    const existingTeacher = await this.constructor.findOne({
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
    const update = this.getUpdate()
    if (update.teachSubject && update.teachSclass) {
      const docToUpdate = await this.model.findOne(this.getQuery())
      const existingTeacher = await this.model.findOne({
        teachSubject: update.teachSubject,
        teachSclass: update.teachSclass
      })

      if (
        existingTeacher &&
        existingTeacher._id.toString() !== docToUpdate._id.toString()
      ) {
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
