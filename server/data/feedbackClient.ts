import knex, { Knex } from 'knex'
import logger from '../../logger'
import { getEndDate, getStartDate } from '../utils/utils'

interface Feedback {
  id: number
  sessionId: string
  feedbackId: string
  date: Date
  title: string
  url: string
  contentType: string
  series: string
  categories: string
  topics: string
  sentiment: string
  comment: string
  establishment: string
}

export default class FeedbackClient {
  connection: Knex

  constructor(private readonly knexConfig: Knex.Config) {
    try {
      this.connection = knex(this.knexConfig)
      logger.debug('Database connection established')
    } catch (error) {
      logger.error('Failed to connect to database', error)
    }
  }

  async retrieveFeedback(startDate: string, endDate: string) {
    const queryStartDate = getStartDate(startDate)
    const queryEndDate = getEndDate(endDate)

    try {
      logger.info(queryStartDate, queryEndDate)
      return this.connection<Feedback>('feedback').select('*').whereBetween('date', [queryStartDate, queryEndDate])
    } catch (error) {
      logger.error('Database select failed', error)
      return Promise.reject()
    }
  }
}
