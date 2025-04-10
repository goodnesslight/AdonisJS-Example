import { AbstractRepository } from '#common/abstracts/repository'
import Account from '#models/account'

export class AccountRepository extends AbstractRepository<typeof Account> {
  constructor() {
    super(Account)
  }
}
