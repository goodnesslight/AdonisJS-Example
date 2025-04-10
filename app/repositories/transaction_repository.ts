import { AbstractRepository } from '#common/abstracts/repository'
import Transaction from '#models/transaction'

export default class TransactionRepository extends AbstractRepository<typeof Transaction> {
  constructor() {
    super(Transaction)
  }

  async getNext(accountId: number, startId: number): Promise<Transaction[]> {
    return Transaction.query()
      .where('account_id', accountId)
      .andWhere('id', '>', startId)
      .orderBy('id')
  }

  async getPrevious(accountId: number, startId: number): Promise<Transaction | null> {
    return await Transaction.query()
      .where('account_id', accountId)
      .andWhere('id', '<', startId)
      .orderBy('id', 'desc')
      .first()
  }

  async getLast(accountId: number): Promise<Transaction | null> {
    return await Transaction.query().where('account_id', accountId).orderBy('id', 'desc').first()
  }

  async getRandom(): Promise<Transaction | null> {
    return await Transaction.query().orderByRaw('RANDOM()').first()
  }
}
