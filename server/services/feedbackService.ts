import FeedbackClient from '../data/feedbackClient'

export default class FeedbackService {
  constructor(private readonly feedbackClient: FeedbackClient) {}

  async retrieveFeedback(startDate: string, endDate: string) {
    return this.feedbackClient.retrieveFeedback(startDate, endDate)
  }
}
