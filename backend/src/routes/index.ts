import { Router } from 'express'
import { EventController } from '../controllers/event.controller'
import { ScraperController } from '../controllers/scraper.controller'
import { scraperLimiter } from '../middlewares/rate-limiter.middleware'
import {
  eventsQuerySchema,
  idParamSchema,
  searchQuerySchema,
  validate,
} from '../middlewares/validation.middleware'
import adminRoutes from './admin.routes'

const router = Router()

// Admin Routes
router.use('/admin', adminRoutes)

// Event Routes
router.get('/events', validate(eventsQuerySchema), EventController.getEvents)
router.get(
  '/events/:id',
  validate(idParamSchema, 'params'),
  EventController.getEventById
)
router.get('/months', EventController.getMonths)
router.get('/stats', EventController.getStats)
router.get('/search', validate(searchQuerySchema), EventController.searchEvents)
router.get('/upcoming', EventController.getUpcomingEvents)
router.get('/categories', EventController.getCategories)
router.get('/map', EventController.getMapEvents)

// Scraper Routes (with stricter rate limit)
router.post('/scrape', scraperLimiter, ScraperController.triggerScrape)
router.get('/scrape/status', ScraperController.getStatus)

export default router
