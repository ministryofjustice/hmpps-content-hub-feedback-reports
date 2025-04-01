import { format } from 'date-fns'
import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
import { Page } from '../../services/auditService'

export default function routes({ auditService, feedbackService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const cleanColumn = (text: string) => (text === 'undefined' || text === 'null' ? '' : text)
  const formatDate = (dateString: string) => format(dateString, 'd MMM y')

  get('/reports', async (req, res, next) => {
    await auditService.logPageView(Page.FEEDBACK_TABLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/feedbackTable')
  })

  get('/reports/data', async (req, res) => {
    const feedback = await feedbackService.retrieveFeedback('', '')
    const parsedFeedback = feedback.map(feedbackEntry => {
      return {
        title: feedbackEntry.title,
        contentType: feedbackEntry.contentType,
        sentiment: feedbackEntry.sentiment,
        comment: cleanColumn(feedbackEntry.comment),
        date: formatDate(feedbackEntry.date),
        categories: feedbackEntry.categories,
        series: cleanColumn(feedbackEntry.series),
        establistment: feedbackEntry.establishment,
      }
    })

    res.send(parsedFeedback)
  })

  return router
}
