import { countFields } from '../utils/utils'

export interface Feedback {
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

export type CountFields = (typeof countFields)[number]

export type CountData = {
  contentType?: string
  sentiment?: string
  comment?: string
  countField: string
}
