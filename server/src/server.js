import http from 'http'
import { Server } from 'socket.io'

import app from './app.js'
import { registerChatSocket } from './sockets/chat.socket.js'

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

registerChatSocket(io)

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  )

})