const express = require('express')
const { authorizeUser } = require('../middlewares/auth')
const {
    createComment,
    getCommentsByNews,
    getCommentDetails,
    getCommentsByParentComment,
    updateComment,
    deleteComment
} = require('../controllers/comment-controller')

const commentRouter = express.Router()
commentRouter.post('/', authorizeUser, createComment)
commentRouter.get('/news/:newsId', getCommentsByNews) // Lấy bình luận theo bài viết
commentRouter.get('/:id', getCommentDetails) // Lấy chi tiết bình luận
commentRouter.get('/parent-comment/:id', getCommentsByParentComment) // Lấy chi tiết bình luận
commentRouter.put('/:id', authorizeUser, updateComment)
commentRouter.delete('/:id', authorizeUser, deleteComment)

module.exports = commentRouter
