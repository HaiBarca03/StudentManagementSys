var bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cloudinary = require('../config/cloudinaryConfig')
require('dotenv').config()
const Student = require('../models/studentSchema.js')
const Subject = require('../models/subjectSchema.js')

const studentRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    const existingStudent = await Student.findOne({
      rollNum: req.body.rollNum,
      school: req.body.adminID,
      sclassName: req.body.sclassName
    })

    if (existingStudent) {
      return res.status(400).json({ message: 'Roll Number already exists' })
    }

    const { password, adminID, ...otherData } = req.body
    const studentData = {
      ...otherData,
      password: hashedPass,
      school: adminID,
      role: 'Student',
      examResult: req.body.examResult || [],
      attendance: req.body.attendance || []
    }

    const student = new Student(studentData)
    const result = await student.save()

    res.status(201).json({
      message: 'Student registered successfully',
      student: { ...result.toObject(), password: undefined }
    })
  } catch (err) {
    console.error('Error registering student:', err)
    res.status(500).json({ message: 'Internal server error', error: err })
  }
}

const studentLogIn = async (req, res) => {
  try {
    let student = await Student.findOne({
      rollNum: req.body.rollNum,
      name: req.body.studentName
    })

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    const validated = await bcrypt.compare(req.body.password, student.password)

    if (!validated) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        name: student.name,
        role: student.role
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: '24h' }
    )

    student = await student.populate('school', 'schoolName')
    student = await student.populate('sclassName', 'sclassName')

    student.password = undefined
    student.examResult = undefined
    student.attendance = undefined

    res.status(200).json({
      ...student.toObject(),
      token
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getStudents = async (req, res) => {
  try {
    let students = await Student.find({ school: req.params.id })
      .populate('sclassName', 'sclassName')
      .sort({ rollNum: 1 })
    if (students.length > 0) {
      let modifiedStudents = students.map((student) => {
        return { ...student._doc, password: undefined }
      })
      res.send(modifiedStudents)
    } else {
      res.send({ message: 'No students found' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const getStudentDetail = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id)
      .populate('school', 'schoolName')
      .populate('sclassName', 'sclassName')
      .populate('examResult.subName', 'subName')
      .populate('attendance.subName', 'subName sessions')
      .select('-password')
    if (student) {
      student.password = undefined
      res.send(student)
    } else {
      res.send({ message: 'No student found' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

const deleteStudent = async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id)
    res.send(result)
  } catch (error) {
    res.status(500).json(err)
  }
}

const deleteStudents = async (req, res) => {
  try {
    const result = await Student.deleteMany({ school: req.params.id })
    if (result.deletedCount === 0) {
      res.send({ message: 'No students found to delete' })
    } else {
      res.send(result)
    }
  } catch (error) {
    res.status(500).json(err)
  }
}

const deleteStudentsByClass = async (req, res) => {
  try {
    const result = await Student.deleteMany({ sclassName: req.params.id })
    if (result.deletedCount === 0) {
      res.send({ message: 'No students found to delete' })
    } else {
      res.send(result)
    }
  } catch (error) {
    res.status(500).json(err)
  }
}

const updateStudent = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }

    let imageData = []

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: 'student-managements/students'
        })
        imageData.push({
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url
        })
      }
    }

    let updateData = { ...req.body }
    if (imageData.length > 0) {
      updateData.images = imageData
    }

    let result = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )

    if (!result) {
      return res.status(404).json({ message: 'Student not found' })
    }

    result.password = undefined
    res.status(200).json(result)
  } catch (error) {
    console.error('Error updating student:', error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}

const updateExamResult = async (req, res) => {
  const { subName, marksObtained } = req.body

  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).send({ message: 'Student not found' })
    }

    const subId = new mongoose.Types.ObjectId(subName)

    const existingResult = student.examResult.find((result) =>
      result.subName.equals(subId)
    )

    if (existingResult) {
      existingResult.marksObtained = marksObtained
    } else {
      student.examResult.push({ subName: subId, marksObtained })
    }

    await Student.findByIdAndUpdate(
      req.params.id,
      { examResult: student.examResult },
      { new: true, runValidators: false }
    )

    return res.send({ message: 'Exam result updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const studentAttendance = async (req, res) => {
  const { subName, status, date } = req.body

  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).send({ message: 'Student not found' })
    }

    const subject = await Subject.findById(subName)
    if (!subject) {
      return res.status(404).send({ message: 'Subject not found' })
    }

    const subId = new mongoose.Types.ObjectId(subName)

    const existingAttendance = student.attendance.find(
      (a) =>
        new Date(a.date).toDateString() === new Date(date).toDateString() &&
        a.subName.equals(subId)
    )

    if (existingAttendance) {
      existingAttendance.status = status
    } else {
      const attendedSessions = student.attendance.filter((a) =>
        a.subName.equals(subId)
      ).length

      if (attendedSessions >= subject.sessions) {
        return res
          .status(400)
          .send({ message: 'Maximum attendance limit reached' })
      }

      student.attendance.push({ date, status, subName: subId })
    }

    await Student.findByIdAndUpdate(
      req.params.id,
      { attendance: student.attendance },
      { new: true, runValidators: false }
    )

    return res.send({ message: 'Attendance updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const clearAllStudentsAttendanceBySubject = async (req, res) => {
  const subName = req.params.id

  try {
    const result = await Student.updateMany(
      { 'attendance.subName': subName },
      { $pull: { attendance: { subName } } }
    )
    return res.send(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

const clearAllStudentsAttendance = async (req, res) => {
  const schoolId = req.params.id

  try {
    const result = await Student.updateMany(
      { school: schoolId },
      { $set: { attendance: [] } }
    )

    return res.send(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

const removeStudentAttendanceBySubject = async (req, res) => {
  const studentId = req.params.id
  const subName = req.body.subId

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $pull: { attendance: { subName: subName } } }
    )

    return res.send(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

const removeStudentAttendance = async (req, res) => {
  const studentId = req.params.id

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $set: { attendance: [] } }
    )

    return res.send(result)
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,
  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance
}
