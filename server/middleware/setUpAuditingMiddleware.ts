import { RequestHandler, Request, Response } from 'express'
import { AuditEvent } from '../data/hmppsAuditClient'

export type AuditingMiddlewareLocals = {
  auditEventPrefix?: string
  auditOptions?: AuditingMiddlewareConfig
  auditFailureMessage?: string
  auditEventGlobalBase?: BaseAuditEventDetailsProvider
  auditEventEndpointBase?: BaseAuditEventDetailsProvider
}

type AuditEventCallback = (auditEvent: AuditEvent) => Promise<void>

type BaseAuditEventDetails = Partial<AuditEvent>
type BaseAuditEventDetailsProvider = (req: Request, res: Response) => BaseAuditEventDetails

type AuditingMiddlewareConfig = {
  auditEventCallback?: AuditEventCallback
  treatNon200ResponseAsFailure?: boolean
  baseAuditEvent?: BaseAuditEventDetailsProvider
}

type AuditingGlobalMiddleware = (options: AuditingMiddlewareConfig) => RequestHandler

export const setUpAuditingMiddleware: AuditingGlobalMiddleware = options => (req, res, next) => {
  res.locals.auditOptions = options
  res.locals.auditEventGlobalBase = options.baseAuditEvent
  next()
}

type AuditableEndpointMiddleware = (auditEventPrefix: string, options?: AuditingMiddlewareConfig) => RequestHandler

export const auditableEndpoint: AuditableEndpointMiddleware =
  (auditEventPrefix, options = {}) =>
  async (req, res, next) => {
    res.locals.auditEventPrefix = auditEventPrefix
    res.locals.auditEventEndpointBase = options.baseAuditEvent

    // Log attempt
    await logAuditEvent('ATTEMPT', req, res)

    // Log success / failure when request ends
    req.on('end', () => onRequestEnd(req, res, next))

    next()
  }

const onRequestEnd: RequestHandler = async (req, res) => {
  const success = res.statusCode < (res.locals.auditOptions.treatNon200ResponseAsFailure ? 300 : 400)
  await logAuditEvent(success ? 'SUCCESS' : 'FAILURE', req, res)
}

type AuditEventSuffix = 'ATTEMPT' | 'SUCCESS' | 'FAILURE'

const logAuditEvent = async (auditEventSuffix: AuditEventSuffix, req: Request, res: Response) => {
  const {
    user,
    auditOptions: { auditEventCallback },
    auditEventPrefix,
    auditFailureMessage,
    auditEventGlobalBase,
    auditEventEndpointBase,
  } = res.locals

  // Validate required options set up correctly
  Object.entries({ auditEventPrefix, auditEventCallback }).forEach(([key, value]) => {
    if (value === undefined) throw new Error(`Please define the required audit option: ${key}`)
  })

  // Construct the audit event
  const globalBaseAuditEvent = auditEventGlobalBase?.(req, res) ?? {}
  const endpointBaseAuditEvent = auditEventEndpointBase?.(req, res) ?? {}

  const correlationId = req.id
  const who = user.username
  const what = `${auditEventPrefix}_${auditEventSuffix}`

  const auditEvent: AuditEvent = {
    ...globalBaseAuditEvent,
    ...endpointBaseAuditEvent,
    what,
    who,
    correlationId,
    details: {
      ...globalBaseAuditEvent?.details,
      ...endpointBaseAuditEvent?.details,
      ...(auditFailureMessage ? { failureReason: auditFailureMessage } : {}),
    },
  }

  await auditEventCallback(auditEvent)
}
