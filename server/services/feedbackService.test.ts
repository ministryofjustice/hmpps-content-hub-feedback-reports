import FeedbackService from './feedbackService'
import FeedbackClient from '../data/feedbackClient'

jest.mock('../data/feedbackClient')

describe('Feedback service', () => {
  let feedbackClient: jest.Mocked<FeedbackClient>
  let feedbackService: FeedbackService

  beforeEach(() => {
    feedbackClient = new FeedbackClient(null) as jest.Mocked<FeedbackClient>
    feedbackService = new FeedbackService(feedbackClient)
  })

  describe('retrieveFeedback', () => {
    it('sends audit message using audit client', async () => {
      await feedbackService.retrieveFeedback('', '')

      expect(feedbackClient.retrieveFeedback).toHaveBeenCalledWith('', '')
    })
  })
})
