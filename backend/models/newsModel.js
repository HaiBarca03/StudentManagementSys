const mongoose = require('mongoose');

const newSchema = new mongoose.Schema(
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
      maxlength: 100
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
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    published: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userType: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: true
    },
    approved: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newSchema);