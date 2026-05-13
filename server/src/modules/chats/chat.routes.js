import express from 'express'
import prisma from '../prisma.js'

const router = express.Router()

// 채팅방 생성
router.post('/room', async (req, res) => {

  try {

    const { user1Id, user2Id } = req.body

    let room = await prisma.chatRoom.findFirst({

      where: {

        AND: [

          {
            users: {
              some: {
                id: user1Id,
              },
            },
          },

          {
            users: {
              some: {
                id: user2Id,
              },
            },
          },

        ],

      },

    })

    if (!room) {

      room = await prisma.chatRoom.create({

        data: {

          users: {

            connect: [
              { id: user1Id },
              { id: user2Id },
            ],

          },

        },

      })

    }

    res.json(room)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: '채팅방 생성 실패',
    })

  }

})

// 메시지 저장
router.post('/message', async (req, res) => {

  try {

    const {
      text,
      senderId,
      chatRoomId,
    } = req.body

    const message = await prisma.message.create({

      data: {
        text,
        senderId,
        chatRoomId,
      },

      include: {
        user: true,
      },

    })

    res.json(message)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: '메시지 저장 실패',
    })

  }

})

// 내 채팅방 목록
router.get('/room/:userId', async (req, res) => {

  try {

    const userId = Number(req.params.userId)

    const rooms = await prisma.chatRoom.findMany({

      where: {

        users: {
          some: {
            id: userId,
          },
        },

      },

      include: {

        users: true,

        messages: {

          orderBy: {
            createdAt: 'desc',
          },

          take: 1,

        },

      },

      orderBy: {
        updatedAt: 'desc',
      },

    })

    const formatted = rooms.map((room) => {

      const otherUser = room.users.find(
        (u) => u.id !== userId
      )

      return {

        id: room.id,

        name:
          otherUser?.name || '알 수 없음',

        profile:
          otherUser?.profile || '😀',

        bio:
          otherUser?.bio || '',

        lastMessage:
          room.messages[0]?.text || '',

        lastTime:
          room.messages[0]?.createdAt || null,

      }

    })

    res.json(formatted)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: '채팅방 조회 실패',
    })

  }

})

// 메시지 조회
router.get('/message/:chatRoomId', async (req, res) => {

  try {

    const messages = await prisma.message.findMany({

      where: {
        chatRoomId: Number(
          req.params.chatRoomId
        ),
      },

      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'asc',
      },

    })

    res.json(messages)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: '메시지 조회 실패',
    })

  }

})

export default router