import { TransactionService } from '#services/transaction_service'
import { ApplicationService } from '@adonisjs/core/types'

export default class TransactionServiceProvider {
  constructor(private readonly app: ApplicationService) {}

  public register(): void {
    this.app.container.singleton('app/services/transaction', () => {
      return this.app.container.make(TransactionService)
    })
  }
}
