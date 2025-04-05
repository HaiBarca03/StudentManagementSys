require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const dbConnect = require('./config/db.config')
const Routes = require('./routes/route.js')
const { initializeSocket } = require('./config/socket.config')

const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
initializeSocket(server)
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(express.json({ limit: '10mb' }))
app.use(cors())

dbConnect()

app.use('/', Routes)

server.listen(PORT, () => {
  console.log(`🚀 Server started at port ${PORT}`)
})
