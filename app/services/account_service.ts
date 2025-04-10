import { inject } from '@adonisjs/core'
import { AccountRepository } from '../repositories/account_repository.js'
import Account from '../models/account.js'

@inject()
export class AccountService {
  constructor(private readonly repository: AccountRepository) {}

  async update(searchPayload: Partial<Account>, updatePayload: Partial<Account>): Promise<void> {
    await this.repository.update(searchPayload, updatePayload)
  }
}
