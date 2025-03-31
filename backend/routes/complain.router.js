const express = require('express')
const {
  complainCreate,
  complainList
} = require('../controllers/complain-controller.js')
const { authorizeUser } = require('../middlewares/auth.js')
complainRouter = express.Router()

complainRouter.post('/ComplainCreate', authorizeUser, complainCreate)
complainRouter.get('/ComplainList/:id', complainList)

module.exports = complainRouter
