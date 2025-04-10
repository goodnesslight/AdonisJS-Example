import { TransactionService } from '#services/transaction_service'
import { ApplicationService } from '@adonisjs/core/types'

export default class TransactionServiceProvider {
  constructor(protected app: ApplicationService) {}

  public register(): void {
    this.app.container.singleton('app/services/transaction', () => {
      return this.app.container.make(TransactionService)
    })
  }

  public async ready(): Promise<void> {
    const service: TransactionService = await this.app.container.make('app/services/transaction')
    await service.simulate()
  }
}
