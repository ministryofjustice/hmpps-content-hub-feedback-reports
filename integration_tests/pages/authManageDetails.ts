import { expect, Locator, Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AuthManageDetailsPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Your account details' })
  }

  static async verifyOnPage(page: Page): Promise<AuthManageDetailsPage> {
    const authManagerPage = new AuthManageDetailsPage(page)
    await expect(authManagerPage.header).toBeVisible()
    return authManagerPage
  }
}
