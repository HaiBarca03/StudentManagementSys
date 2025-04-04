const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 255
    },
    thumbnail: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    summary: {
      type: String,
      maxlength: 255
    },
    slug: {
      type: String,
      maxlength: 100,
      unique: true
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
    content: {
      type: String
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userRef'
      }
    ],
    shareBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userRef'
      }
    ],
    // số lượng cmt
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    // đc đăng hay chưa hay đã xóa. Vì có cả admin duyệt bài
    published: {
      type: Boolean,
      default: false
    },
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
    approved: {
      type: Boolean,
      default: false
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'topic',
      required: true
    }
  },
  { timestamps: true }
)

newsSchema.virtual('userRef').get(function () {
  const typeToCollection = {
    Student: 'student',
    Teacher: 'teacher',
    Admin: 'admin'
  }
  return typeToCollection[this.userType]
})

newsSchema.methods.createShare = async function (userId) {
  if (!this.shareBy.includes(userId)) {
    this.shareBy.push(userId)
  }

  this.shares += 1
  await this.save()
  return true
}

module.exports = mongoose.model('news', newsSchema)
