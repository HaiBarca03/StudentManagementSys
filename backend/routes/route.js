const express = require('express')
const router = express.Router()

const studentRouter = require('./student.router')
const subjectRouter = require('./subject.router')
const noticeRouter = require('./notice.router')
const complainRouter = require('./complain.router')
const teacherRouter = require('./teacher.router')
const classRouter = require('./class.router')
const adminRouter = require('./admin.router')
const newsRouter = require('./newsRouter')
const commentRouter = require('./comment.router')
const topicRouter = require('./topic.router')

router.use('/', studentRouter)
router.use('/', subjectRouter)
router.use('/', noticeRouter)
router.use('/', complainRouter)
router.use('/', teacherRouter)
router.use('/', classRouter)
router.use('/', adminRouter)
router.use('/', newsRouter)
router.use('/', commentRouter)
router.use('/topic', topicRouter)

module.exports = router
