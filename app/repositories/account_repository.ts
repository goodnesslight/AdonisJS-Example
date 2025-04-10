import { AbstractRepository } from '../common/abstracts/repository.js'
import Account from '../models/account.js'

export class AccountRepository extends AbstractRepository<typeof Account> {
  constructor() {
    super(Account)
  }
}
