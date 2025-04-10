import { Exception } from '@adonisjs/core/exceptions'
import Transaction from '#models/transaction'
import TransactionRepository from '#repositories/transaction_repository'
import { inject } from '@adonisjs/core/container'
import { faker } from '@faker-js/faker'
import redis from '@adonisjs/redis/services/main'
import { TransactionType } from '#common/enums/transaction_type'
import { AccountService } from '#services/account_service'

@inject()
export class TransactionService {
  constructor(
    private readonly accountService: AccountService,
    private readonly repository: TransactionRepository
  ) {}

  private readonly simulatingDelay: number = 10_000 // 10 sec

  private readonly simulatingMinPrice: number = 100
  private readonly simulatingMaxPrice: number = 100

  private isSimulating: boolean = false

  simulate(): void {
    if (this.isSimulating) {
      return
    }

    setInterval(async () => {
      const transaction: Transaction | null = await this.repository.getRandom()

      if (!transaction) {
        throw new Exception('Transaction was not found!')
      }

      const price: number = Number.parseFloat(
        faker.finance.amount({ min: this.simulatingMinPrice, max: this.simulatingMaxPrice })
      )
      await this.update(transaction.id, price)
    }, this.simulatingDelay)

    this.isSimulating = true
  }

  async update(id: number, price: number): Promise<void> {
    const transaction: Transaction | null = await this.repository.findOne(id)

    if (!transaction) {
      throw new Exception('Transaction was not found!')
    }

    await redis.set(
      this.formatBackupRedisKey(transaction.id),
      JSON.stringify({
        price: transaction.price,
        balanceAfter: transaction.balanceAfter,
      })
    )
    transaction.price = price
    await transaction.save()
    await this.recalculate(transaction.accountId, transaction.id)

    const lastTransaction: Transaction | null = await this.repository.getLast(transaction.accountId)

    if (lastTransaction) {
      await this.accountService.update(
        { id: transaction.accountId },
        { balance: lastTransaction.balanceAfter }
      )
    }
  }

  private async recalculate(accountId: number, startId: number): Promise<void> {
    const transactions: Transaction[] = await this.repository.getNext(accountId, startId)
    const previousTransaction: Transaction | null = await this.repository.getPrevious(
      accountId,
      startId
    )
    let previousTransactionBalance: number = 0

    if (previousTransaction) {
      previousTransactionBalance = previousTransaction.balanceAfter
    }

    for (const transaction of transactions) {
      const signedTransactionAmount: number =
        transaction.type === TransactionType.Expense ? -transaction.price : transaction.price
      const newTransactionBalance: number = previousTransactionBalance + signedTransactionAmount

      await redis.set(
        this.formatBackupRedisKey(transaction.id),
        JSON.stringify({
          price: transaction.price,
          balanceAfter: transaction.balanceAfter,
        })
      )
      transaction.balanceAfter = newTransactionBalance
      previousTransactionBalance = newTransactionBalance
      await transaction.save()
    }
  }

  private formatBackupRedisKey(id: number): string {
    return `backup:transaction:${id}`
  }
}
