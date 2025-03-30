const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const dbConnect = async () => {
  const dbUrl =
    'mongodb+srv://duchai:duchai@mongodb.uv8cn.mongodb.net/StudentManagement?retryWrites=true&w=majority&appName=MongoDB'
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = dbConnect
