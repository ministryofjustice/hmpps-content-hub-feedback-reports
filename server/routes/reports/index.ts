import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../../middleware/asyncMiddleware'
import type { Services } from '../../services'
import { Page } from '../../services/auditService'

export default function routes({ auditService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    await auditService.logPageView(Page.FEEDBACK_TABLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    res.render('pages/feedbackTable')
  })

  // get('/data', async (req, res) => {
  //   const components = await serviceCatalogueService.getComponents()

  //   res.send(components)
  // })

  return router
}
