import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { requireAdmin } from '../middlewares/auth.middleware'

const router = Router()

// Public route - Login
router.post('/login', AdminController.login)

// Protected routes - require admin authentication
router.get('/dashboard', requireAdmin, AdminController.getDashboard)
router.get('/events', requireAdmin, AdminController.getEvents)
router.get('/events/:id', requireAdmin, AdminController.getEvent)
router.post('/events', requireAdmin, AdminController.createEvent)
router.put('/events/:id', requireAdmin, AdminController.updateEvent)
router.delete('/events/:id', requireAdmin, AdminController.deleteEvent)

export default router
