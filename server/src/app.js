import express from 'express'
import cors from 'cors'

import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/users/user.routes.js'
import chatRoutes from './modules/chats/chat.routes.js'

const app = express()

app.use(cors({
  origin: '*',
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Pick Messenger API running!')
})

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/chat', chatRoutes)

export default app