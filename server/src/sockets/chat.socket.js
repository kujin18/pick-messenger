export const registerChatSocket = (io) => {

  io.on('connection', (socket) => {

    console.log('유저 연결')

    socket.on('join_room', (roomId) => {

      socket.join(String(roomId))

    })

    socket.on('send_message', (data) => {

      socket.to(
        String(data.chatRoomId)
      ).emit(
        'receive_message',
        data
      )

    })

    socket.on('typing', (data) => {

      socket.to(
        String(data.chatRoomId)
      ).emit(
        'typing',
        data
      )

    })

  })

}