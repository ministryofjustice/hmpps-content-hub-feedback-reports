import knex from 'knex'
import FeedbackClient from './feedbackClient'

jest.mock('knex')

const mockSelect = jest.fn()
const querybuilder = {
  select: mockSelect.mockReturnValue({
    whereBetween: jest.fn().mockReturnThis(),
  }),
}
const mockKnex = jest.fn().mockReturnValue(querybuilder)

// @ts-expect-error Typescript treating variable as a type
knex.mockReturnValue(mockKnex)

describe.skip('FeedbackClient', () => {
  describe('.retrieveFeedback', () => {
    it('should retrieve requested feedback', async () => {
      const client = new FeedbackClient(null)
      const feedbackData = {
        title: 'some title',
        url: 'some url',
        contentType: 'some content type',
        series: 'some series',
        categories: 'some categories',
        topics: 'some topic',
        sentiment: 'some sentiment',
        comment: 'some comment',
        date: 'some date',
        establishment: 'some establishment',
        sessionId: 'some sessionId',
        feedbackId: 'some feedbackId',
      }

      // mockSelect.mockReturnValue([feedbackData])

      await client.retrieveFeedback('1/1/2024', '1/1/2024')

      expect(mockSelect).toHaveReturnedWith([feedbackData])
    })
  })
})
