import express from 'express'
import authRoute from './routes/auth'
import connectDB from './config/db'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
connectDB()

const PORT = 8080

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoute)

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})
