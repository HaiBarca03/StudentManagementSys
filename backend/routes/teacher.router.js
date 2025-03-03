const express = require('express')
const {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  deleteTeachers,
  deleteTeacher,
  updateTeacherSubject,
  teacherAttendance,
  deleteTeachersByClass
} = require('../controllers/teacher-controller.js')
teacherRouter = express.Router()

teacherRouter.post('/TeacherReg', teacherRegister)
teacherRouter.post('/TeacherLogin', teacherLogIn)
teacherRouter.get('/Teachers/:id', getTeachers)
teacherRouter.get('/Teacher/:id', getTeacherDetail)
teacherRouter.delete('/Teachers/:id', deleteTeachers)
teacherRouter.delete('/TeachersClass/:id', deleteTeachersByClass)
teacherRouter.delete('/Teacher/:id', deleteTeacher)
teacherRouter.put('/TeacherSubject', updateTeacherSubject)
teacherRouter.post('/TeacherAttendance/:id', teacherAttendance)

module.exports = teacherRouter
