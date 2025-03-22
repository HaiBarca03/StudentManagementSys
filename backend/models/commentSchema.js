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
  };
  return typeToCollection[this.userType];
});

module.exports = mongoose.model('comment', commentSchema)
