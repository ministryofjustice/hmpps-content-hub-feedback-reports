import { CountData, CountFields, Feedback } from '../@types/feedbackClient'
import FeedbackClient from '../data/feedbackClient'

export default class FeedbackService {
  constructor(private readonly feedbackClient: FeedbackClient) {}

  async retrieveFeedback(startDate: string, endDate: string): Promise<Feedback[]> {
    return this.feedbackClient.retrieveFeedback(startDate, endDate)
  }

  async retrieveFeedbackCount(fieldName: CountFields, startDate: string, endDate: string): Promise<CountData[]> {
    return this.feedbackClient.retrieveFeedbackCount(fieldName, startDate, endDate)
  }
}
