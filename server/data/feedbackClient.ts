import knex, { Knex } from 'knex'
import logger from '../../logger'

interface Feedback {
  id: number
  sessionId: string
  feedbackId: string
  date: string
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
    try {
      return this.connection<Feedback>('feedback').select('*')
    } catch (error) {
      logger.error('Database select failed', error)
      return Promise.reject()
    }
  }
}
