const express = require('express')
const {
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
} = require('../controllers/student_controller.js')
studentRouter = express.Router()

studentRouter.post('/StudentReg', studentRegister)
studentRouter.post('/StudentLogin', studentLogIn)
studentRouter.get('/Students/:id', getStudents)
studentRouter.get('/Student/:id', getStudentDetail)
studentRouter.delete('/Students/:id', deleteStudents)
studentRouter.delete('/StudentsClass/:id', deleteStudentsByClass)
studentRouter.delete('/Student/:id', deleteStudent)
studentRouter.put('/Student/:id', updateStudent)
studentRouter.put('/UpdateExamResult/:id', updateExamResult)
studentRouter.put('/StudentAttendance/:id', studentAttendance)
studentRouter.put(
  '/RemoveAllStudentsSubAtten/:id',
  clearAllStudentsAttendanceBySubject
)
studentRouter.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance)
studentRouter.put(
  '/RemoveStudentSubAtten/:id',
  removeStudentAttendanceBySubject
)
studentRouter.put('/RemoveStudentAtten/:id', removeStudentAttendance)

module.exports = studentRouter
