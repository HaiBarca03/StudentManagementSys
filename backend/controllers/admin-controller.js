const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Admin = require('../models/adminSchema.js')
const Sclass = require('../models/sclassSchema.js')
const Student = require('../models/studentSchema.js')
const Teacher = require('../models/teacherSchema.js')
const Subject = require('../models/subjectSchema.js')
const Notice = require('../models/noticeSchema.js')
const Complain = require('../models/complainSchema.js')

const adminRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    const admin = new Admin({
      ...req.body,
      password: hashedPass
    })

    const existingAdminByEmail = await Admin.findOne({ email: req.body.email })
    const existingSchool = await Admin.findOne({
      schoolName: req.body.schoolName
    })

    if (existingAdminByEmail) {
      res.send({ message: 'Email already exists' })
    } else if (existingSchool) {
      res.send({ message: 'School name already exists' })
    } else {
      let result = await admin.save()
      result.password = undefined
      res.send(result)
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const adminLogIn = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' })
    }

    let admin = await Admin.findOne({ email: req.body.email })
    if (!admin) {
      return res.status(404).json({ message: 'User not found' })
    }

    const validated = await bcrypt.compare(req.body.password, admin.password)
    if (!validated) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        schoolName: admin.schoolName
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: '24h' }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      schoolName: admin.schoolName
    })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getAdminDetail = async (req, res) => {
  const userId = req.user.id
  try {
    let admin = await Admin.findById(req.params.id)
    if (admin) {
      admin.password = undefined
      res.send(admin)
    } else {
      res.send({ message: 'No admin found' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const deleteAdmin = async (req, res) => {
  try {
    const result = await Admin.findByIdAndDelete(req.params.id)

    await Sclass.deleteMany({ school: req.params.id })
    await Student.deleteMany({ school: req.params.id })
    await Teacher.deleteMany({ school: req.params.id })
    await Subject.deleteMany({ school: req.params.id })
    await Notice.deleteMany({ school: req.params.id })
    await Complain.deleteMany({ school: req.params.id })

    res.send(result)
  } catch (error) {
    res.status(500).json(err)
  }
}

const updateAdmin = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      res.body.password = await bcrypt.hash(res.body.password, salt)
    }
    let result = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )

    result.password = undefined
    res.send(result)
  } catch (error) {
    res.status(500).json(err)
  }
}

module.exports = {
  adminRegister,
  adminLogIn,
  getAdminDetail,
  deleteAdmin,
  updateAdmin
}
