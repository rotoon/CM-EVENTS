import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'hype-cnx-admin-secret-key'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export interface AdminRequest extends Request {
  admin?: { authenticated: boolean }
}

/**
 * Generate JWT token for admin
 */
export function generateAdminToken(): string {
  return jwt.sign({ role: 'admin', authenticated: true }, JWT_SECRET, {
    expiresIn: '24h',
  })
}

/**
 * Verify admin password and return token
 */
export function verifyAdminLogin(password: string): string | null {
  if (password === ADMIN_PASSWORD) {
    return generateAdminToken()
  }
  return null
}

/**
 * Middleware to protect admin routes
 */
export function requireAdmin(
  req: AdminRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ success: false, error: 'Unauthorized - No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      role: string
      authenticated: boolean
    }

    if (decoded.role !== 'admin' || !decoded.authenticated) {
      res
        .status(403)
        .json({ success: false, error: 'Forbidden - Invalid admin token' })
      return
    }

    req.admin = { authenticated: true }
    next()
  } catch (error) {
    res
      .status(401)
      .json({ success: false, error: 'Unauthorized - Invalid token' })
    return
  }
}
