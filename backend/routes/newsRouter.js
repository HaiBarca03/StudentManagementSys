const express = require('express')
const multer = require('multer')
const {
  getAllNews,
  getNewsById,
  createNews,
  approveNews,
  likeNews,
  shareNews,
  getLatestNews,
  getMostLikedNews,
  getMonthlyStats,
  getNewsByUserId,
  deleteNewsById,
  updateNew,
  deleteNewImage
} = require('../controllers/newsController')
const { authorizeUser, authorizeAdmin } = require('../middlewares/auth')
const {
  uploadThumbnail,
  uploadImages,
  uploadNewsFiles
} = require('../middlewares/uploadCloudinary') // Đảm bảo đường dẫn đúng

const router = express.Router()

// Routes
router.get('/', getAllNews)
router.get('/latest', getLatestNews)
router.get('/most-liked', getMostLikedNews)
router.get('/monthly-stats', authorizeUser, getMonthlyStats)
router.get('/user', authorizeUser, getNewsByUserId)
router.get('/:id', getNewsById)
router.delete('/:newsId', authorizeUser, deleteNewsById)
router.delete(
  '/:newId/image/:imageId',
  authorizeUser,
  uploadImages,
  deleteNewImage
)
router.put('/:id', authorizeUser, uploadNewsFiles, updateNew)
router.post('/:newsId/share', authorizeUser, shareNews)
router.post(
  '/',
  authorizeUser,
  (req, res, next) => {
    uploadNewsFiles(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ error: `Lỗi upload file: ${err.message}` })
      } else if (err) {
        return res.status(400).json({ error: err.message })
      }
      console.log('✅ Files uploaded successfully:', req.files)
      next()
    })
  },
  createNews
)
router.put('/approve/:id', authorizeUser, authorizeAdmin, approveNews)

module.exports = router
