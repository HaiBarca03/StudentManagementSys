const { Server } = require('socket.io')

let io

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket)
    })
  })
}

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io chưa được khởi tạo!')
  }
  return io
}

module.exports = { initializeSocket, getIO }
