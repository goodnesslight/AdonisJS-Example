import { ApplicationService } from '@adonisjs/core/types'
import TransactionRepository from '#repositories/transaction_repository'

export default class TransactionRepositoryProvider {
  constructor(private readonly app: ApplicationService) {}

  public register(): void {
    this.app.container.singleton('app/repositories/transaction', () => {
      return this.app.container.make(TransactionRepository)
    })
  }
}
