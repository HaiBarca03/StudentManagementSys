const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    rollNum: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sclass',
      required: true
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
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
      }],
    email: {
      type: String,
      required: false
    },
    phone: {
      type: Number,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    dateOfBirth: {
      type: Date,
      required: false
    },
    sex: {
      type: String,
      enum: ['male', 'female']
    },
    role: {
      type: String,
      default: 'Student'
    },
    major: {
      type: String,
      required: true,
      enum: [
        'Công nghệ thông tin',
        'Quản trị kinh doanh',
        'Kế toán',
        'Du lịch',
        'Ngôn ngữ Anh',
        'Kỹ thuật ô tô',
        'Kỹ thuật điện',
        'Cơ điện tử',
        'Thiết kế đồ hoạ'
      ]
    },
    examResult: [
      {
        subName: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'subject'
        },
        marksObtained: {
          type: Number,
          default: 0
        }
      }
    ],
    schoolEntryDay: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Đang học', 'Đã học xong', 'Đã nghỉ học', 'Đã chuyển trường']
    },
    nation: {
      type: String,
      required: true,
      enum: ['Kinh', 'Mường', 'Tày', 'Nùng']
    },
    religion: {
      type: String,
      required: true,
      enum: ['Phật', 'Cao đài', 'Hồi giáo', 'Kito', 'Tin lành']
    },
    nationality: {
      type: String,
      required: true,
      enum: ['Việt Nam', 'Lào', 'Campuchia', 'Thái Lan', 'Indonesia']
    },
    typeOfTraining: {
      type: String,
      required: true,
      enum: ['Chính quy', 'Tại chức', 'Văn bằng 2', 'Văn bằng 2 chất lượng']
    },
    trainingLevel: {
      type: String,
      required: true,
      enum: ['Đại học', 'Cao đẳng', 'Trung cấp']
    },
    attendance: [
      {
        date: {
          type: Date,
          required: true
        },
        status: {
          type: String,
          enum: ['Present', 'Absent'],
          required: true
        },
        subName: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'subject',
          required: true
        }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('student', studentSchema)
