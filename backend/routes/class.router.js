const express = require('express')

const {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents
} = require('../controllers/class-controller.js')

const classRouter = express.Router()

classRouter.post('/SclassCreate', sclassCreate)
classRouter.get('/SclassList/:id', sclassList)
classRouter.get('/Sclass/:id', getSclassDetail)
classRouter.get('/Sclass/Students/:id', getSclassStudents)
classRouter.delete('/Sclasses/:id', deleteSclasses)
classRouter.delete('/Sclass/:id', deleteSclass)

module.exports = classRouter
