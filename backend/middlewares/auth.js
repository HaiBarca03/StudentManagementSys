const TeacherSchema = require('../models/teacherSchema')
const AdminSchema = require('../models/adminSchema')
const StudentSchema = require('../models/teacherSchema')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const authorizeTeacher = async (req, res, next) => {
  try {
    const authHeader = req.headers.token
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing. Authorization denied.'
      })
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

    const user = await TeacherSchema.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authorization error:', error.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid access token. Authorization denied.'
    })
  }
}

const authorizeAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.token
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing. Authorization denied.'
      })
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

    const user = await AdminSchema.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authorization error:', error.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid access token. Authorization denied.'
    })
  }
}

const authorizeStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.token
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing. Authorization denied.'
      })
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

    const user = await StudentSchema.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authorization error:', error.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid access token. Authorization denied.'
    })
  }
}

module.exports = {
  authorizeTeacher,
  authorizeAdmin,
  authorizeStudent
}
