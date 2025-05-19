import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes, user } from '../testutils/appSetup'
import AuditService from '../../services/auditService'
import FeedbackService from '../../services/feedbackService'

jest.mock('../../services/auditService')
jest.mock('../../services/feedbackService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>
const feedbackService = new FeedbackService(null) as jest.Mocked<FeedbackService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
      feedbackService,
    },
    userSupplier: () => user,
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Reports', () => {
  describe('GET /reports/data', () => {
    it('should send feedback data as JSON ', () => {
      feedbackService.retrieveFeedback.mockResolvedValue([
        {
          id: 1,
          sessionId: 'session id',
          feedbackId: 'feedback id',
          date: new Date('2024-01-01'),
          title: 'some title',
          url: '/url/to/something',
          contentType: 'AUDIO',
          series: 'some series',
          categories: 'category1, category 2',
          topics: 'some topic',
          sentiment: 'LIKE',
          comment: 'undefined',
          establishment: 'BERWYN',
        },
      ])

      return request(app)
        .get('/reports/data/all/1-1-2024/31-1-2024')
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.text).toBe(
            '[{"title":"some title","contentType":"AUDIO","sentiment":"LIKE","comment":"","date":"1 Jan 2024","categories":"category1, category 2","series":"some series","establistment":"BERWYN"}]',
          )
          expect(feedbackService.retrieveFeedback).toHaveBeenCalledWith('1/1/2024', '31/1/2024', 'all')
        })
    })
  })
})
