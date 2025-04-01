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
  getMonthlyStats
} = require('../controllers/newsController')
const { authorizeUser, authorizeAdmin } = require('../middlewares/auth')
const {
  uploadThumbnail,
  uploadImages,
  uploadNewsFiles
} = require('../middlewares/uploadCloudinary') // Đảm bảo đường dẫn đúng

const router = express.Router()

// Middleware để log request chi tiết
// Middleware để log request chi tiết
router.use((req, res, next) => {
  console.log('📥 Received request:', req.method, req.path)
  console.log('📦 Body:', req.body)
  console.log('📎 Files:', req.files)
  console.log(
    '📋 Field names received:',
    Object.keys(req.body).concat(req.files ? Object.keys(req.files) : [])
  )
  next()
})


// Routes
router.get('/', getAllNews)
router.get('/latest', getLatestNews)
router.get('/most-liked', getMostLikedNews); 
router.get('/monthly-stats', authorizeUser, getMonthlyStats)
router.get('/:id', getNewsById)

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
