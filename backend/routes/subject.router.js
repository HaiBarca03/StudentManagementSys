const express = require('express')
const {
  subjectCreate,
  allSubjects,
  classSubjects,
  freeSubjectList,
  getSubjectDetail,
  deleteSubject,
  deleteSubjects,
  deleteSubjectsByClass
} = require('../controllers/subject-controller.js')
subjectRouter = express.Router()

subjectRouter.post('/SubjectCreate', subjectCreate)
subjectRouter.get('/AllSubjects/:id', allSubjects)
subjectRouter.get('/ClassSubjects/:id', classSubjects)
subjectRouter.get('/FreeSubjectList/:id', freeSubjectList)
subjectRouter.get('/Subject/:id', getSubjectDetail)
subjectRouter.delete('/Subject/:id', deleteSubject)
subjectRouter.delete('/Subjects/:id', deleteSubjects)
subjectRouter.delete('/SubjectsClass/:id', deleteSubjectsByClass)

module.exports = subjectRouter
