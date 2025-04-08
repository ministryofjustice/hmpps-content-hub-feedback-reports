import { DateTime } from 'luxon'
import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
import { Page } from '../../services/auditService'
import { fromDatePicker } from '../../utils/utils'

export default function routes({ auditService, feedbackService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const cleanColumn = (text: string) => (text === 'undefined' || text === 'null' ? '' : text)
  const formatDate = (unformattedDate: Date) => DateTime.fromISO(unformattedDate.toISOString()).toFormat('d LLL yyyy')

  get('/reports', async (req, res, _next) => {
    const { startDate, endDate } = req.query

    await auditService.logPageView(Page.FEEDBACK_TABLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/feedbackTable', {
      startDate: fromDatePicker(startDate as unknown as string),
      endDate: fromDatePicker(endDate as unknown as string),
    })
  })

  get('/reports/data/:startDate/:endDate', async (req, res) => {
    const startDate = fromDatePicker(req.params.startDate.replaceAll('-', '/'))
    const endDate = fromDatePicker(req.params.endDate.replaceAll('-', '/'))

    const feedback = await feedbackService.retrieveFeedback(startDate, endDate)
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
