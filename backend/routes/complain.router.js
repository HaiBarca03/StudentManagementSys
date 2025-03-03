const express = require('express')
const {
  complainCreate,
  complainList
} = require('../controllers/complain-controller.js')
complainRouter = express.Router()

complainRouter.post('/ComplainCreate', complainCreate)
complainRouter.get('/ComplainList/:id', complainList)

module.exports = complainRouter
