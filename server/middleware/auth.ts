import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.ts'
import type { User } from '../../src/types/index.ts'

/**
 * Payload stored inside the JWT access token.
 */
interface TokenPayload {
  userId: string
  email: string
  role: User['role']
  name: string
}

/**
 * Express middleware that verifies the JWT access token.
 * Expected header format: Authorization: Bearer <token>
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Access token missing' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    res.locals.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' })
      return
    }
    res.status(403).json({ message: 'Invalid token' })
  }
}
