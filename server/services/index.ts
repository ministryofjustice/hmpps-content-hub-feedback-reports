import { dataAccess } from '../data'
import AuditService from './auditService'
import FeedbackService from './feedbackService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, feedbackClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const feedbackService = new FeedbackService(feedbackClient)

  return {
    applicationInfo,
    auditService,
    feedbackService,
  }
}

export type Services = ReturnType<typeof services>
