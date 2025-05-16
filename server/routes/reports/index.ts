import { DateTime } from 'luxon'
import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
import { Page } from '../../services/auditService'
import { countFields, fromDatePicker } from '../../utils/utils'
import { CountData, CountFields, Feedback } from '../../@types/feedbackClient'
import config from '../../config'

export default function routes({ auditService, feedbackService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const cleanColumn = (text: string) => (text === 'undefined' || text === 'null' ? '' : text)
  const formatDate = (unformattedDate: Date) => DateTime.fromISO(unformattedDate.toISOString()).toFormat('d LLL yyyy')
  type ChartData = [string, string | number, string | object]
  const countDataToChartData = (countData: CountData[], fieldName: CountFields) => {
    const chartData: ChartData[] = countData.map(data => [
      data[fieldName] ? data[fieldName] : 'N/A',
      Number.parseInt(data.countField, 10),
      data.countField,
    ])
    chartData.unshift([fieldName, 'Count', { role: 'annotation' }])

    return chartData
  }

  get('/reports', async (req, res, _next) => {
    const { startDate, endDate, prison } = req.query

    await auditService.logPageView(Page.FEEDBACK_TABLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    const prisonsDropDown = config.sites.map(site => {
      return {
        value: site,
        text: site,
        selected: prison === site,
      }
    })

    res.render('pages/feedbackTable', {
      startDate: fromDatePicker(startDate as unknown as string),
      endDate: fromDatePicker(endDate as unknown as string),
      prisonsDropDown,
      prison,
    })
  })

  get('/reports/charts', async (req, res, _next) => {
    const startDate = (req.query.startDate as string) ?? ''
    const endDate = (req.query.endDate as string) ?? ''
    const prison = (req.query.prison as string) ?? ''
    const cleanStartDate = fromDatePicker(startDate.replaceAll('-', '/'))
    const cleanEndDate = fromDatePicker(endDate.replaceAll('-', '/'))

    await auditService.logPageView(Page.FEEDBACK_CHARTS_PAGE, { who: res.locals.user.username, correlationId: req.id })

    const chartData = await Promise.all(
      countFields.map(async fieldName => {
        return {
          [fieldName]: await feedbackService.retrieveFeedbackCount(fieldName, cleanStartDate, cleanEndDate, prison),
        }
      }),
    )

    const prisonsDropDown = config.sites.map(site => {
      return {
        value: site,
        text: site,
        selected: prison === site,
      }
    })

    res.render('pages/feedbackCharts', {
      startDate: cleanStartDate,
      endDate: cleanEndDate,
      contentTypeData: JSON.stringify(countDataToChartData(chartData[0].contentType, 'contentType')),
      sentimentData: JSON.stringify(countDataToChartData(chartData[1].sentiment, 'sentiment')),
      commentData: JSON.stringify(countDataToChartData(chartData[2].comment, 'comment')),
      prisonsDropDown,
      prison,
    })
  })

  get('/reports/data/:prison/:startDate/:endDate', async (req, res) => {
    const prison = req.params.prison ?? 'all'
    const startDate = fromDatePicker(req.params.startDate.replaceAll('-', '/'))
    const endDate = fromDatePicker(req.params.endDate.replaceAll('-', '/'))

    const feedback: Feedback[] = await feedbackService.retrieveFeedback(startDate, endDate, prison)
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

  get('/reports/chart-data/:prison/:startDate/:endDate', async (req, res) => {
    const prison = req.params.prison ?? 'all'
    const startDate = fromDatePicker(req.params.startDate.replaceAll('-', '/'))
    const endDate = fromDatePicker(req.params.endDate.replaceAll('-', '/'))

    const contentTypeData: CountData[] = await feedbackService.retrieveFeedbackCount(
      'contentType',
      startDate,
      endDate,
      prison,
    )
    const commentData: CountData[] = await feedbackService.retrieveFeedbackCount('comment', startDate, endDate, prison)
    const sentimentsData: CountData[] = await feedbackService.retrieveFeedbackCount(
      'sentiment',
      startDate,
      endDate,
      prison,
    )

    res.send({
      contentTypeData,
      commentData,
      sentimentsData,
    })
  })

  return router
}
