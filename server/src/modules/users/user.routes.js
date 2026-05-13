import express from 'express'

import prisma from '../prisma.js'

const router = express.Router()

router.get('/', async (req, res) => {

  try {

    const users =
      await prisma.user.findMany({

        orderBy: {
          createdAt: 'desc',
        },

      })

    res.json(users)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      message: '유저 불러오기 실패',
    })

  }

})

export default router