import { ApplicationService } from '@adonisjs/core/types'
import { TransactionService } from '#services/transaction_service'
import env from '#start/env'

export default class AppProvider {
  constructor(private readonly app: ApplicationService) {}

  public async ready(): Promise<void> {
    if (env.get('DB_UPDATING')) {
      return
    }

    const service: TransactionService = await this.app.container.make('app/services/transaction')
    await service.simulate()
  }
}
