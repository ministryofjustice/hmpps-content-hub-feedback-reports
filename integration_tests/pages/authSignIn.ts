import type { Locator, Page } from '@playwright/test'
import AbstractPage from './abstractPage'

export default class AuthSignInPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Sign in' })
  }
}
