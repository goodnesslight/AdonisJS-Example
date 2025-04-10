import { ApplicationService } from '@adonisjs/core/types'
import { AccountRepository } from '#repositories/account_repository'

export default class AccountRepositoryProvider {
  constructor(private readonly app: ApplicationService) {}

  public register(): void {
    this.app.container.singleton('app/repositories/account', () => {
      return this.app.container.make(AccountRepository)
    })
  }
}
