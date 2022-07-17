import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { checkAuth } from '../middleware/checkAuth'

const router = express.Router()

router.post(
  '/signup',
  body('email').isEmail().withMessage('the email is invalid'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('the password is too short'),
  async (req, res) => {
    // error from express validator
    const validatorError = validationResult(req)

    if (!validatorError.isEmpty()) {
      const errors = validatorError.array().map((error) => {
        return {
          msg: error.msg,
        }
      })
      return res.json({ errors, data: null })
    }
    const { email, password } = req.body

    // verify if user already exist
    const user = await User.findOne({ email })

    if (user) {
      return res.json({
        errors: [
          {
            msg: 'Email already in use',
          },
        ],
        data: null,
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      email,
      password: hashedPassword,
    })

    const token = await jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: 36000,
      }
    )

    res.json({
      errors: [],
      data: {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          //  stripeCustomerId: customer.id,
        },
      },
    })
  }
)

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.json({
      errors: [
        {
          msg: 'Invalids credentials',
        },
      ],
      data: null,
    })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.json({
      errors: [
        {
          msg: 'Invalids credentials',
        },
      ],
      data: null,
    })
  }

  const token = await jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 36000,
    }
  )

  return res.json({
    errors: [],
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    },
  })
})
router.get('/me', checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user })

  return res.json({
    errors: [],
    data: {
      user,
      // user: {
      //   id: user._id,
      //   email: user.email,
      // },
    },
  })
})
export default router
