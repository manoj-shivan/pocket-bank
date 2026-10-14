import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { mockUser } from '../data/mock.ts'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.ts'
import { authenticateToken } from '../middleware/auth.ts'
import type { User } from '../../src/types/index.ts'

const router = Router()

/**
 * POST /api/auth/login
 * Verifies demo credentials and returns a signed JWT access token.
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  if (email !== 'admin@example.com' || password !== 'password') {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const token = jwt.sign(
    {
      userId: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      name: mockUser.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  res.json({
    user: mockUser,
    token,
  })
})

/**
 * POST /api/auth/logout
 * The server is stateless for JWT, so logout is handled client-side
 * by removing the token. This endpoint exists for completeness.
 */
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out' })
})

/**
 * GET /api/auth/me
 * Returns the current user based on the verified JWT access token.
 * Protected by the authenticateToken middleware.
 */
router.get('/me', authenticateToken, (req, res) => {
  const decoded = res.locals.user as {
    userId: string
    email: string
    role: User['role']
    name: string
  }

  const user: User = {
    id: decoded.userId,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
  }

  res.json(user)
})

export default router
