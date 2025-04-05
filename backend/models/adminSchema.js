const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
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
      default: 'Admin'
    },
    schoolName: {
      type: String,
      unique: true,
      required: true
    },
    permissions: {
      type: [String],
      default: ['approve_posts', 'manage_users']
    }
  },
  { timestamps: true }
)

adminSchema.pre('save', async function (next) {
  const admin = this

  const existingAdminBySchoolName = await mongoose.model('admin').findOne({
    schoolName: admin.schoolName
  })

  const existingAdminByEmail = await mongoose.model('admin').findOne({
    email: admin.email
  })

  if (existingAdminBySchoolName) {
    return next(new Error('An admin account already exists for this school.'))
  }

  if (existingAdminByEmail) {
    return next(new Error('An admin account already exists with this email.'))
  }

  next()
})

module.exports = mongoose.model('admin', adminSchema)
