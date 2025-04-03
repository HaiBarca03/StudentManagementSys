//newsController.js
const News = require('../models/newSchema')
const Topic = require('../models/topicSchema')
const fs = require('fs')
const cloudinary = require('../config/cloudinaryConfig')
const slugify = require('slugify')
const mongoose = require('mongoose')

const getAllNews = async (req, res) => {
  try {
    let { page, limit, approved, search } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5
    const approvedFilter = approved === 'false' ? false : true

    // Tạo query object cơ bản
    const query = { approved: approvedFilter }

    // Thêm điều kiện tìm kiếm nếu có
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    // Đếm tổng số bài viết phù hợp
    const totalNews = await News.countDocuments(query)
    const totalPages = Math.ceil(totalNews / limit)

    // Lấy danh sách bài viết với phân trang
    const news = await News.find(query)
      .populate({
        path: 'userId',
        select: 'name avatar'
      })
      .populate({
        path: 'topicId',
        select: 'name description'
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    res.status(200).json({
      success: true,
      page,
      totalPages,
      totalNews,
      limit,
      news
    })
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error)
    res.status(500).json({
      success: false,
      error: 'Lỗi server khi lấy danh sách bài viết'
    })
  }
}
// Lấy 10 bài viết mới nhất
const getLatestNews = async (req, res) => {
  try {
    const latestNews = await News.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const formattedNews = latestNews.map((news) => ({
      _id: news._id,
      title: news.title,
      datePosted: news.createdAt,
      slug: news.slug
    }))

    res.status(200).json({
      message: '10 bài viết mới nhất',
      data: formattedNews
    })
  } catch (error) {
    console.error('Lỗi khi lấy bài viết mới nhất:', error)
    res.status(500).json({ error: 'Lỗi server khi lấy bài viết mới nhất' })
  }
}
const getNewsByUserId = async (req, res) => {
  try {
    const userId = req.user.id
    const { status } = req.query

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    let query = { userId: userId }
    if (status === 'true') {
      query.approved = true
    } else if (status === 'false') {
      query.approved = false
    }

    const userNews = await News.find(query)
      .populate({
        path: 'userId',
        select: 'name images'
      })
      .populate({
        path: 'topicId',
        select: 'name description'
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    if (!userNews || userNews.length === 0) {
      return res.status(404).json({
        message: `No news found for this user with status ${status || 'all'}`
      })
    }

    const formattedNews = userNews.map((news) => ({
      _id: news._id,
      title: news.title,
      datePosted: news.createdAt,
      slug: news.slug,
      comments: news.comments,
      likes: news.likes,
      thumbnail: news.thumbnail,
      user: news.userId,
      summary: news.summary
    }))

    res.status(200).json({
      message: `Latest news articles by user ${userId} with status ${
        status || 'all'
      }`,
      data: formattedNews
    })
  } catch (error) {
    console.error('Error fetching news by user ID:', error)
    res
      .status(500)
      .json({ error: 'Server error while fetching news by user ID' })
  }
}
// Lấy các bài viết có nhiều like nhất
const getMostLikedNews = async (req, res) => {
  try {
    const { limit } = req.query
    const newsLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50) // Đảm bảo 1 <= limit <= 50

    const mostLikedNews = await News.find({ approved: true })
      .select('title createdAt likes slug')
      .sort({ likes: -1, createdAt: -1 })
      .limit(newsLimit)
      .lean()

    if (!mostLikedNews.length) {
      return res.status(200).json({
        message: 'Không tìm thấy bài viết nào',
        data: []
      })
    }

    const formattedNews = mostLikedNews.map((news) => ({
      title: news.title || 'Không có tiêu đề',
      datePosted: news.createdAt,
      likes: news.likes || 0,
      slug: news.slug || '',
      _id: news._id
    }))

    res.status(200).json({
      message: 'Các bài viết được thích nhiều nhất',
      data: formattedNews
    })
  } catch (error) {
    console.error('Lỗi chi tiết khi lấy bài viết được thích nhiều nhất:', {
      message: error.message,
      stack: error.stack
    })
    res.status(500).json({
      error: 'Lỗi server khi lấy bài viết được thích nhiều nhất',
      details: error.message
    })
  }
}
// Lấy chi tiết bài viết theo ID
const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name username avatar email'
      })
      .populate({
        path: 'topicId',
        select: 'name description'
      })
      .lean()

    if (!newsItem)
      return res.status(404).json({ error: 'Không tìm thấy bài viết' })

    // Xử lý userId
    if (!newsItem.userId) {
      newsItem.userId = { _id: null, name: 'Unknown User' }
    } else {
      newsItem.userId = {
        _id: newsItem.userId._id,
        name: newsItem.userId.name || 'Unknown User',
        username: newsItem.userId.username || '',
        avatar: newsItem.userId.avatar || '',
        email: newsItem.userId.email || ''
      }
    }
    newsItem.userRef = newsItem.userType || null
    res.status(200).json(newsItem)
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết bài viết:', error)
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết bài viết' })
  }
}
const deleteNewsById = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role
    const { newsId } = req.params
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ error: 'Invalid news ID' })
    }

    const newsItem = await News.findById(newsId)

    if (!newsItem) {
      return res.status(404).json({ error: 'News article not found' })
    }

    if (newsItem.userId.toString() !== userId && userRole !== 'Admin') {
      return res
        .status(403)
        .json({ error: 'Unauthorized to delete this article' })
    }

    await News.findByIdAndDelete(newsId)
    res.status(200).json({ message: 'News article deleted successfully' })
  } catch (error) {
    console.error('Error deleting news article:', error)
    res.status(500).json({ error: 'Server error while deleting news article' })
  }
}
// Duyệt bài viết (Admin)
// newsController.js - sửa lại hàm approveNews
const approveNews = async (req, res) => {
  try {
    // Kiểm tra token hợp lệ
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc hết hạn'
      })
    }

    const { id } = req.params

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID bài viết không hợp lệ'
      })
    }

    const news = await News.findById(id)
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      })
    }

    if (news.approved) {
      return res.status(400).json({
        success: false,
        message: 'Bài viết đã được duyệt trước đó'
      })
    }

    // Kiểm tra quyền
    if (!req.user.permissions.includes('approve_posts')) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền duyệt bài viết'
      })
    }

    // Cập nhật thông tin duyệt bài
    news.approved = true
    news.approvedBy = req.user._id
    news.approvedAt = new Date()

    await news.save()

    res.status(200).json({
      success: true,
      message: 'Duyệt bài viết thành công',
      news
    })
  } catch (error) {
    console.error('Lỗi khi duyệt bài viết:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi duyệt bài viết',
      error: error.message
    })
  }
}
// Tạo slug duy nhất
const generateUniqueSlug = async (title) => {
  let baseSlug = slugify(title, { lower: true, strict: true })

  const existingSlugs = await News.find({
    slug: new RegExp(`^${baseSlug}(-\\d+)?$`)
  }).select('slug')

  if (!existingSlugs.length) {
    return baseSlug
  }

  const slugNumbers = existingSlugs.map((item) => {
    const match = item.slug.match(/-(\d+)$/)
    return match ? parseInt(match[1]) : 0
  })

  const nextNumber = Math.max(...slugNumbers) + 1
  return `${baseSlug}-${nextNumber}`
}
// Tạo bài viết mới
const createNews = async (req, res) => {
  try {
    const { title, summary, content, userId, topicId, published } = req.body
    const userType = req.user.role

    if (!title || !summary || !content || !userId || !userType || !topicId) {
      return res.status(400).json({ error: 'Thiếu dữ liệu bắt buộc' })
    }

    let validTopicId = topicId
    if (!topicId || topicId.trim() === '') {
      // Nếu không có topicId, tự động tạo chủ đề mới
      const newTopic = new Topic({ name: title }) // Hoặc đặt tên theo logic riêng
      const savedTopic = await newTopic.save()
      validTopicId = savedTopic._id
    } else {
      // Kiểm tra xem topicId có tồn tại không
      const existingTopic = await Topic.findById(topicId)
      if (!existingTopic) {
        return res.status(400).json({ error: 'Chủ đề không hợp lệ' })
      }
    }

    let thumbnailData = null
    let images = []

    // Kiểm tra và upload thumbnail
    if (
      !req.files ||
      !req.files.thumbnail ||
      req.files.thumbnail.length === 0
    ) {
      return res.status(400).json({ error: 'Thiếu thumbnail' })
    }
    const thumbnailFile = req.files.thumbnail[0]
    const thumbnailResult = await cloudinary.uploader.upload(
      thumbnailFile.path,
      {
        folder: 'news_thumbnails'
      }
    )
    thumbnailData = {
      public_id: thumbnailResult.public_id,
      url: thumbnailResult.secure_url
    }
    fs.unlinkSync(thumbnailFile.path)

    // Upload images nếu có
    if (req.files && req.files.images) {
      images = await Promise.all(
        req.files.images.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'news_images'
          })
          fs.unlinkSync(file.path)
          return {
            public_id: result.public_id,
            url: result.secure_url
          }
        })
      )
    }

    const slug = await generateUniqueSlug(title)

    const newNews = new News({
      title,
      summary,
      content,
      slug,
      thumbnail: thumbnailData,
      images,
      userId,
      userType,
      topicId: validTopicId,
      published: published === 'true',
      approved: false
    })

    await newNews.save()

    res.status(201).json({
      message: '🎉 Bài viết đã được tạo, chờ duyệt bởi admin.',
      data: newNews
    })
  } catch (error) {
    console.error('❌ Lỗi khi tạo bài viết:', error)
    res
      .status(500)
      .json({ message: 'Lỗi khi tạo bài viết', error: error.message })
  }
}
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().select('name description')
    if (!topics.length) {
      console.log('No topics found in database')
    }
    res.status(200).json(topics)
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chủ đề:', error)
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách chủ đề' })
  }
}
const likeNews = async (req, res) => {
  try {
    const { newsId } = req.params
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ message: 'newsId không hợp lệ' })
    }

    const news = await News.findById(newsId)
    if (!news) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' })
    }

    const userObjectId = new mongoose.Types.ObjectId(userId) // ✅ Chuyển userId thành ObjectId
    const hasLiked = news.likedBy.some((id) => id.equals(userObjectId)) // ✅ So sánh đúng kiểu dữ liệu

    if (hasLiked) {
      // Nếu đã like -> Bỏ like
      news.likedBy = news.likedBy.filter((id) => !id.equals(userObjectId))
      news.likes -= 1
    } else {
      // Nếu chưa like -> Like
      news.likedBy.push(userObjectId)
      news.likes += 1
    }

    await news.save()

    res.status(200).json({
      message: hasLiked ? 'Đã bỏ thích' : 'Đã thích',
      likes: news.likes,
      likedBy: news.likedBy
    })
  } catch (error) {
    console.error('Error liking news:', error)
    res.status(500).json({ message: 'Lỗi server nội bộ', error: error.message })
  }
}
// Chức năng Share
const shareNews = async (req, res) => {
  try {
    const { newsId } = req.params
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ message: 'newsId không hợp lệ' })
    }

    const news = await News.findById(newsId)
    if (!news) {
      return res.status(404).json({ message: 'Bài viết không tồn tại' })
    }

    // Tăng số lượt share
    news.shares += 1
    await news.save()

    res.status(200).json({
      message: 'Đã chia sẻ bài viết',
      shares: news.shares
    })
  } catch (error) {
    console.error('Lỗi khi chia sẻ bài viết:', error)
    res.status(500).json({
      message: 'Lỗi server khi chia sẻ bài viết',
      error: error.message
    })
  }
}
const getMonthlyStats = async (req, res) => {
  try {
    const stats = await News.aggregate([
      {
        $match: {
          createdAt: { $exists: true } // Đảm bảo chỉ lấy bài có ngày tạo
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ['$approved', true] }, 1, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$approved', false] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: '%m/%Y',
              date: {
                $dateFromParts: {
                  year: '$_id.year',
                  month: '$_id.month',
                  day: 1
                }
              }
            }
          },
          total: 1,
          approved: 1,
          pending: 1
        }
      }
    ])

    res.json(stats)
  } catch (err) {
    console.error('Error in getMonthlyStats:', err)
    res.status(500).json({
      error: 'Lỗi khi lấy thống kê',
      details: err.message
    })
  }
}
const updateNew = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const useRole = req.user.role
    const { title, summary, content, topicId } = req.body

    const news = await News.findById(id)
    if (!news) {
      return res.status(404).json({ message: 'News not found' })
    }

    if (
      !new mongoose.Types.ObjectId(userId).equals(news.userId) ||
      !useRole === 'Admin'
    ) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: You cannot update this comment' })
    }

    let newImages = []
    if (req.files && req.files.length > 0) {
      newImages = await Promise.all(
        req.files.map(async (file) => {
          const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: 'student-managements/news_images'
          })
          return {
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url
          }
        })
      )
    }

    let newThumbnail = null
    if (req.files && req.files['thumbnail']) {
      const thumbnailFile = req.files['thumbnail'][0]
      const uploadedThumbnail = await cloudinary.uploader.upload(
        thumbnailFile.path,
        {
          folder: 'student-managements/thumbnails'
        }
      )
      fs.unlinkSync(thumbnailFile.path)

      newThumbnail = {
        public_id: uploadedThumbnail.public_id,
        url: uploadedThumbnail.secure_url
      }

      if (news.thumbnail && news.thumbnail.public_id) {
        await cloudinary.uploader.destroy(news.thumbnail.public_id)
      }
    }

    if (title) news.title = title
    if (summary) news.summary = summary
    if (content) news.content = content
    if (topicId) news.topicId = topicId
    if (newImages.length > 0) news.images.push(...newImages)
    if (newThumbnail) news.thumbnail = newThumbnail

    const updatedNews = await news.save()
    res.status(200).json(updatedNews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteNewImage = async (req, res) => {
  try {
    const { newId, imageId } = req.params
    const userId = req.user.id

    const news = await News.findById(newId)
    if (!news) {
      return res.status(404).json({ message: 'news not found' })
    }

    if (!new mongoose.Types.ObjectId(userId).equals(news.userId)) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: You cannot delete this image' })
    }

    const imageToDelete = news.images.find(
      (img) => img._id.toString() === imageId
    )
    if (!imageToDelete) {
      return res.status(404).json({ message: 'Image not found in this news' })
    }

    await cloudinary.uploader.destroy(imageToDelete.public_id)

    news.images = news.images.filter((img) => img._id.toString() !== imageId)

    await news.save()

    res.status(200).json({ message: 'Image deleted successfully', news })
  } catch (error) {
    console.error('Error deleting image from news:', error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}
module.exports = {
  getNewsByUserId,
  getAllNews,
  getNewsById,
  createNews,
  approveNews,
  getAllTopics,
  likeNews,
  getLatestNews,
  getMostLikedNews,
  shareNews,
  getMonthlyStats,
  deleteNewsById,
  updateNew,
  deleteNewImage
}
