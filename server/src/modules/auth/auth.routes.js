// routes/auth.js
import express from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../prisma.js' // make sure prisma client is exported from prisma.js

const router = express.Router()

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { phone, name, profile, bio, interests, modes } = req.body

    if (!phone && !name) {
      return res.status(400).json({ message: '전화번호 or 이름 필요' })
    }

    // 먼저 phone이 있으면 phone 기준, 없으면 name 기준으로 조회
    let user;
    if (phone) {
      user = await prisma.user.findUnique({ where: { phone } });
    } else if (name) {
     // name은 unique가 아니라면 findFirst 사용
       user = await prisma.user.findFirst({ where: { name } });
    }

    // 없으면 새 User 생성
    if (!user) {
      user = await prisma.user.create({
      data: {
        phone: phone || "",                   
        name: name || "",  
        profile: profile || "",       
        bio: bio || "",               
        interests: Array.isArray(interests) ? interests : [],  
        modes: Array.isArray(modes) ? modes : [],                      
    }
      })
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )

    res.json({ token, user })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: '서버 오류' })
  }
})

export default router