import knex, { Knex } from 'knex'
import logger from '../../logger'
import { getEndDate, getStartDate } from '../utils/utils'
import { CountData, CountFields, Feedback } from '../@types/feedbackClient'

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

  async retrieveFeedback(startDate: string, endDate: string, prison: string): Promise<Feedback[]> {
    const queryStartDate = getStartDate(startDate)
    const queryEndDate = getEndDate(endDate)
    const prisonName = prison !== '' && prison !== 'all' ? prison : ''

    try {
      return this.connection<Feedback>('feedback')
        .select('*')
        .whereBetween('date', [queryStartDate, queryEndDate])
        .modify(query => {
          if (prisonName !== '') {
            query.where('establishment', prison.toLocaleUpperCase())
          }
        })
    } catch (error) {
      logger.error('retrieveFeedback query failed', error)
      return Promise.resolve([])
    }
  }

  async retrieveFeedbackCount(
    fieldName: CountFields,
    startDate: string,
    endDate: string,
    prison: string,
  ): Promise<CountData[]> {
    const queryStartDate = getStartDate(startDate)
    const queryEndDate = getEndDate(endDate)
    const prisonName = prison !== '' && prison !== 'all' ? prison : ''

    try {
      return this.connection('feedback')
        .select(fieldName)
        .count(`${fieldName} as countField`)
        .whereBetween('date', [queryStartDate, queryEndDate])
        .modify(query => {
          if (fieldName === 'comment') {
            query.whereNot('comment', 'undefined')
          }
          if (prisonName !== '') {
            query.where('establishment', prison.toLocaleUpperCase())
          }
        })
        .groupBy(fieldName)
        .orderBy('countField', 'desc')
    } catch (error) {
      logger.error('retrieveFeedbackCount query failed', error)
      return Promise.resolve([])
    }
  }
}
