require('dotenv').config();
const express = require('express')
const cors = require('cors')
const dbConnect = require('./config/db.config')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const Routes = require('./routes/route.js')
const newsRoutes = require('./routes/newsRouter.js')

const PORT = process.env.PORT || 5000
const app = express()

dotenv.config()

// ✅ Middleware xử lý JSON và URL-encoded body
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(express.json({ limit: '10mb' }))
app.use(cors())

// ✅ Kiểm tra body có được nhận không
app.use((req, res, next) => {
  console.log(`📥 Received request: ${req.method} ${req.url}`)
  console.log('📦 Body:', req.body) // Debug dữ liệu gửi lên
  next()
})

dbConnect()

// ✅ Routes
app.use('/', Routes)
app.use('/api/news', newsRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server started at port ${PORT}`)
})
