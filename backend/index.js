require('dotenv').config();
const express = require('express')
const cors = require('cors')
const dbConnect = require('./config/db.config')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const Routes = require('./routes/route.js')

const PORT = process.env.PORT || 5000
const app = express()

dotenv.config()

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))
app.use(cors())

dbConnect()

app.use('/', Routes)

app.listen(PORT, () => {
  console.log(`🚀 Server started at port ${PORT}`)
})
