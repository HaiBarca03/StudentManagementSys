const express = require('express')
const {
  noticeCreate,
  noticeList,
  deleteNotices,
  deleteNotice,
  updateNotice
} = require('../controllers/notice-controller.js')
noticeRouter = express.Router()

noticeRouter.post('/NoticeCreate', noticeCreate)
noticeRouter.get('/NoticeList/:id', noticeList)
noticeRouter.delete('/Notices/:id', deleteNotices)
noticeRouter.delete('/Notice/:id', deleteNotice)
noticeRouter.put('/Notice/:id', updateNotice)

module.exports = noticeRouter
