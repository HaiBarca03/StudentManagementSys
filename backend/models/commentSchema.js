const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userRef'
    },
    userType: {
      type: String,
      enum: ['Student', 'Teacher', 'Admin'],
      required: true
    },
    content: {
      type: String,
      required: false
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
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userRef'
      }
    ],
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'news'
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
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
commentSchema.virtual('userRef').get(function () {
  const typeToCollection = {
    Student: 'student',
    Teacher: 'teacher',
    Admin: 'admin'
  }
  return typeToCollection[this.userType]
})

const badWords = ['mẹ mày', 'cụ mày', 'thằng chó', 'thằng dở hơi']

commentSchema.pre('save', function (next) {
  const content = this.content

  if (badWords.some((word) => content.toLowerCase().includes(word))) {
    const error = new Error('Comment contains inappropriate language.')
    next(error)
  } else {
    next()
  }
})

module.exports = mongoose.model('comment', commentSchema)
