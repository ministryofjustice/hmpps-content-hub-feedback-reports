import { Router } from 'express'
import { Page } from '../../services/auditService'
import { Services } from '../../services'

export default function routes({ auditService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res, next) => {
    await auditService.logPageView(Page.HOME_PAGE, { who: res.locals.user.username, correlationId: req.id })
    return res.render('pages/homepage')
  })

  return router
}
