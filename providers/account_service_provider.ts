import { ApplicationService } from '@adonisjs/core/types'
import { AccountService } from '#services/account_service'

export default class AccountServiceProvider {
  constructor(private readonly app: ApplicationService) {}

  public register(): void {
    this.app.container.singleton('app/services/account', () => {
      return this.app.container.make(AccountService)
    })
  }
}
