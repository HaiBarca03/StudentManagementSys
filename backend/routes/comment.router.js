const express = require('express')
const { authorizeUser } = require('../middlewares/auth')
const {
  createComment,
  getCommentsByNews,
  getCommentDetails,
  getCommentsByParentComment,
  updateComment,
  deleteComment,
  deleteCommentImage
} = require('../controllers/comment-controller')
const { uploadImages } = require('../middlewares/uploadCloudinary')

const commentRouter = express.Router()
commentRouter.post('/', authorizeUser, uploadImages, createComment)
commentRouter.get('/news/:newsId', getCommentsByNews) // Lấy bình luận theo bài viết
commentRouter.get('/:id', getCommentDetails) // Lấy chi tiết bình luận
commentRouter.get('/parent-comment/:parentId', getCommentsByParentComment) // Lấy chi tiết bình luận
commentRouter.put('/:id', authorizeUser, uploadImages, updateComment)
commentRouter.delete('/:id', authorizeUser, deleteComment)
commentRouter.delete(
  '/:commentId/image/:imageId',
  authorizeUser,
  uploadImages,
  deleteCommentImage
)

module.exports = commentRouter
