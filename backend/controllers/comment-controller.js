const Comment = require('../models/commentSchema')
const mongoose = require('mongoose')
const cloudinary = require('../config/cloudinaryConfig')
const newSchema = require('../models/newSchema')
const { getIO } = require('../config/socket.config')
const createComment = async (req, res) => {
  try {
    const userId = req.user.id
    const userType = req.user.role
    const { content, newsId, parentId } = req.body
    let newImages = []

    if (req.files && req.files.length > 0) {
      newImages = await Promise.all(
        req.files.map(async (file) => {
          const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: 'student-managements/comments'
          })
          return {
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url
          }
        })
      )
    }

    if (!content && newImages.length === 0) {
      return res
        .status(400)
        .json({ message: 'Comment must have content or images' })
    }

    const comment = await Comment.create({
      userId,
      userType,
      content,
      images: newImages,
      newsId,
      parentId
    })

    await newSchema.updateOne({ _id: newsId }, { $inc: { comments: 1 } })
    const io = getIO()
    io.emit(`new-comment-${newsId}`, {
      message: 'Có bình luận mới',
      commentId: comment._id
    })

    res.status(201).json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

const getCommentsByNews = async (req, res) => {
  try {
    const { newsId } = req.params
    const comments = await Comment.find({ newsId })
      .populate('userId', 'name') // Lấy thông tin người dùng
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

const getCommentDetails = async (req, res) => {
  try {
    const { id } = req.params

    const comment = await Comment.findById(id).populate({
      path: 'userId',
      select: 'name'
    }) // Lấy thông tin người dùng

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.status(200).json(comment)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

const getCommentsByParentComment = async (req, res) => {
  try {
    const { parentId } = req.params
    const parentObjectId = new mongoose.Types.ObjectId(parentId)

    const comments = await Comment.find({ parentId: parentObjectId }).populate({
      path: 'userId',
      select: 'name userRef'
    })

    res.status(200).json(comments)
  } catch (error) {
    console.error('Lỗi khi lấy comments:', error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}

const updateComment = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { content, status } = req.body
    const comment = await Comment.findById(id)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    let newImages = []

    if (req.files && req.files.length > 0) {
      newImages = await Promise.all(
        req.files.map(async (file) => {
          const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: 'student-managements/comments'
          })
          return {
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url
          }
        })
      )
    }
    if (!new mongoose.Types.ObjectId(userId).equals(comment.userId)) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: You cannot update this comment' })
    }

    if (content) comment.content = content
    if (newImages.length > 0) comment.images = newImages
    if (status) comment.status = status

    await comment.save()
    res.status(200).json({ message: 'Comment updated successfully', comment })
  } catch (error) {
    console.error('Error updating comment:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

const deleteCommentImage = async (req, res) => {
  try {
    const { commentId, imageId } = req.params
    const userId = req.user.id

    // Tìm comment theo ID
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    // Kiểm tra quyền sở hữu
    if (!new mongoose.Types.ObjectId(userId).equals(comment.userId)) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: You cannot delete this image' })
    }

    // Tìm ảnh trong comment (dùng .find() để lấy object thay vì index)
    const imageToDelete = comment.images.find(
      (img) => img._id.toString() === imageId
    )
    if (!imageToDelete) {
      return res
        .status(404)
        .json({ message: 'Image not found in this comment' })
    }

    // Xóa ảnh trên Cloudinary
    await cloudinary.uploader.destroy(imageToDelete.public_id)

    // Xóa ảnh khỏi mảng images
    comment.images = comment.images.filter(
      (img) => img._id.toString() !== imageId
    )

    // Lưu lại comment sau khi cập nhật
    await comment.save()

    res.status(200).json({ message: 'Image deleted successfully', comment })
  } catch (error) {
    console.error('Error deleting image from comment:', error)
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params

    const comment = await Comment.findById(id)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    if (comment.images && comment.images.length > 0) {
      await Promise.all(
        comment.images.map(async (image) => {
          try {
            await cloudinary.uploader.destroy(image.public_id)
          } catch (err) {
            console.error(
              `Failed to delete image ${image.public_id}:`,
              err.message
            )
          }
        })
      )
    }

    await Comment.findByIdAndDelete(id)
    res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error })
  }
}

const like = async (req, res) => {
  try {
    const { commentId } = req.params
    const userId = req.user.id

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' })
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const userObjectId = new mongoose.Types.ObjectId(userId)
    const hasLiked = comment.likedBy.some((id) => id.equals(userObjectId))

    let updatedComment
    if (hasLiked) {
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $pull: { likedBy: userObjectId },
          $inc: { likes: -1 }
        },
        { new: true }
      )
    } else {
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $addToSet: { likedBy: userObjectId },
          $inc: { likes: 1 }
        },
        { new: true }
      )
    }

    if (updatedComment.likes !== updatedComment.likedBy.length) {
      updatedComment.likes = updatedComment.likedBy.length
      await updatedComment.save()
    }

    return res.json({
      message: hasLiked ? 'Unliked successfully' : 'Liked successfully',
      likes: updatedComment.likes,
      likedBy: updatedComment.likedBy
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createComment,
  getCommentsByNews,
  getCommentDetails,
  getCommentsByParentComment,
  updateComment,
  deleteCommentImage,
  deleteComment,
  like
}
