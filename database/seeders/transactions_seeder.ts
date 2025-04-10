import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import cliProgress from 'cli-progress'
import db from '@adonisjs/lucid/services/db'
import { TransactionType } from '#common/enums/transaction_type'
import Account from '#models/account'
import Transaction from '#models/transaction'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class TransactionSeeder extends BaseSeeder {
  private readonly amount: number = 10_000

  private readonly minPrice: number = 100
  private readonly maxPrice: number = 1_000

  private readonly chunkSize: number = 1_000

  public async run() {
    const trx: TransactionClientContract = await db.transaction()

    try {
      const transactions: Partial<Transaction>[] = []
      const account: Account | null = await Account.first({ client: trx })

      if (!account) {
        throw new Error('First account was not found!')
      }

      const multibar: cliProgress.MultiBar = new cliProgress.MultiBar(
        {
          clearOnComplete: false,
          hideCursor: true,
          format: '[{bar}] {percentage}% | {value}/{total} | {label}',
        },
        cliProgress.Presets.shades_classic
      )
      const transactionsBuildingBar: cliProgress.SingleBar = multibar.create(this.amount, 0, {
        label: 'Building transactions',
      })

      for (let i = 0; i < this.amount; i++) {
        const accountId: number = account.id
        const price: number = Number.parseFloat(
          faker.finance.amount({ min: this.minPrice, max: this.maxPrice })
        )
        const type: TransactionType = faker.helpers.arrayElement(Object.values(TransactionType))

        account.balance =
          type === TransactionType.Income ? account.balance + price : account.balance - price

        transactions.push({
          accountId,
          type,
          price,
          balanceAfter: account.balance,
        })

        transactionsBuildingBar.increment()
      }

      const creatingTransactionsBar: cliProgress.SingleBar = multibar.create(
        this.amount / this.chunkSize,
        0,
        { label: 'Creating transactions' }
      )

      for (let i = 0; i < transactions.length; i += this.chunkSize) {
        await Transaction.createMany(transactions.slice(i, i + this.chunkSize), { client: trx })
        creatingTransactionsBar.increment()
      }

      multibar.stop()
      await account.save()
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error(error)
    }
  }
}
