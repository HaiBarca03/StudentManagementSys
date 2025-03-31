const TeacherSchema = require('../models/teacherSchema')
const AdminSchema = require('../models/adminSchema')
const StudentSchema = require('../models/studentSchema')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const extractToken = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.split(' ')[1]
}

const authorizeTeacher = async (req, res, next) => {
  try {
    const authHeader = req.headers.token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Thiếu token truy cập.' })
    }
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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Thiếu token truy cập.' })
    }
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Thiếu token truy cập. Xác thực bị từ chối.'
      })
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)

    const user = await AdminSchema.findById(decoded.id)
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy người dùng' })
    }

    // Kiểm tra quyền duyệt bài viết
    if (
      !Array.isArray(user.permissions) ||
      !user.permissions.includes('approve_posts')
    ) {
      return res.status(403).json({
        success: false,
        message: 'Quyền bị từ chối. Admin không thể phê duyệt bài viết.'
      })
    }
    req.user = user
    next()
  } catch (error) {
    console.error('Lỗi xác thực:', error.message)
    return res.status(401).json({
      success: false,
      message: 'Token truy cập không hợp lệ. Xác thực bị từ chối.'
    })
  }
}

const authorizeStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Thiếu token truy cập.' })
    }
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

const authorizeUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.token
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing. Authorization denied.'
      })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
    let user
    switch (decoded.role) {
      case 'Student':
        user = await StudentSchema.findById(decoded.id)
        break
      case 'Teacher':
        user = await TeacherSchema.findById(decoded.id)
        break
      case 'Admin':
        user = await AdminSchema.findById(decoded.id)
        break
      default:
        return res
          .status(403)
          .json({ success: false, message: 'Invalid user type' })
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    req.user = { id: user._id, role: decoded.role }
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
  authorizeStudent,
  authorizeUser
}
