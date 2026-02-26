import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class IndexPage extends AbstractPage {
  readonly header: Locator

  readonly headerUserName: Locator

  readonly headerPhaseBanner: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Content Hub Feedback' })
    this.headerUserName = page.locator('[data-qa=header-user-name]')
    this.headerPhaseBanner = page.locator('[data-qa=header-phase-banner]')
  }

  static async verifyOnPage(page: Page): Promise<IndexPage> {
    const indexPage = new IndexPage(page)
    await expect(indexPage.header).toBeVisible()
    return indexPage
  }
}
