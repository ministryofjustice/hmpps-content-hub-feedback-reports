import { CountData, CountFields, Feedback } from '../@types/feedbackClient'
import FeedbackClient from '../data/feedbackClient'

export default class FeedbackService {
  constructor(private readonly feedbackClient: FeedbackClient) {}

  async retrieveFeedback(startDate: string, endDate: string, prison: string): Promise<Feedback[]> {
    return this.feedbackClient.retrieveFeedback(startDate, endDate, prison)
  }

  async retrieveFeedbackCount(
    fieldName: CountFields,
    startDate: string,
    endDate: string,
    prison: string,
  ): Promise<CountData[]> {
    return this.feedbackClient.retrieveFeedbackCount(fieldName, startDate, endDate, prison)
  }
}
