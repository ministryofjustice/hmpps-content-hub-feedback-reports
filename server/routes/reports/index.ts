import { DateTime } from 'luxon'
import { Router, Request } from 'express'

import type { Services } from '../../services'
import { countFields, fromDatePicker } from '../../utils/utils'
import { CountData, CountFields, Feedback } from '../../@types/feedbackClient'
import config from '../../config'
import { auditableEndpoint } from '../../middleware/setUpAuditingMiddleware'

export default function routes({ feedbackService }: Services): Router {
  const router = Router()

  const baseAuditEvent = (req: Request) => {
    const { startDate, endDate, prison } = req.query
    return {
      details: { startDate, endDate, prison },
    }
  }

  router.get('/reports', auditableEndpoint('VIEW_FEEDBACK_TABLE', { baseAuditEvent }), async (req, res, _next) => {
    const { startDate, endDate, prison } = req.query

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

  router.get(
    '/reports/charts',
    auditableEndpoint('VIEW_FEEDBACK_CHARTS', { baseAuditEvent }),
    async (req, res, _next) => {
      const startDate = (req.query.startDate as string) ?? ''
      const endDate = (req.query.endDate as string) ?? ''
      const prison = (req.query.prison as string) ?? ''
      const cleanStartDate = fromDatePicker(startDate.replaceAll('-', '/'))
      const cleanEndDate = fromDatePicker(endDate.replaceAll('-', '/'))

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
    },
  )

  router.get('/reports/data/:prison/:startDate/:endDate', async (req, res) => {
    const prison = req.params.prison?.toString() ?? 'all'
    const startDate = fromDatePicker(req.params.startDate?.toString().replaceAll('-', '/'))
    const endDate = fromDatePicker(req.params.endDate?.toString().replaceAll('-', '/'))

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

  router.get('/reports/chart-data/:prison/:startDate/:endDate', async (req, res) => {
    const prison = req.params.prison?.toString() ?? 'all'
    const startDate = fromDatePicker(req.params.startDate?.toString().replaceAll('-', '/'))
    const endDate = fromDatePicker(req.params.endDate?.toString().replaceAll('-', '/'))

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

  return router
}
