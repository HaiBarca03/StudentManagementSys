const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userType: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    images: [
      {
        public_id: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }
    ],
    likes: {
      type: Number,
      default: 0
    },
    newsId: {
      type: Number,
      required: true,
      ref: 'news'
    },
    parentId: {
      type: Number,
      ref: 'comment',
      default: null
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('comment', commentSchema)
