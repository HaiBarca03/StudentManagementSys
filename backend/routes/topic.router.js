const express = require('express')
const { authorizeAdmin } = require('../middlewares/auth')
const {
  createTopic,
  getAllTopics,
  getTopicDetails,
  updateTopic,
  deleteTopic
} = require('../controllers/topic-controller')

topicRouter = express.Router()

topicRouter.post('/', authorizeAdmin, createTopic)
topicRouter.get('/', getAllTopics)
topicRouter.get('/:id', getTopicDetails)
topicRouter.put('/:id', authorizeAdmin, updateTopic)
topicRouter.delete('/:id', authorizeAdmin, deleteTopic)

module.exports = topicRouter
