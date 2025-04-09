import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import cliProgress from 'cli-progress'
import { TransactionType } from '@app/common/enums/transaction_type.js'
import Transaction from '@app/models/transaction.js'
import db from '@adonisjs/lucid/services/db'
import Account from '@app/models/account.js'

export default class TransactionSeeder extends BaseSeeder {
  private readonly amount = 10_000
  private readonly minPrice = 1_000
  private readonly maxPrice = 1_000
  private readonly chunkSize = 1_000

  public async run() {
    const trx = await db.transaction()

    try {
      const transactions: Partial<Transaction>[] = []
      const accounts: Account[] = await Account.all({ client: trx })
      const accountBalances: Record<number, number> = {}
      const multibar = new cliProgress.MultiBar(
        {
          clearOnComplete: false,
          hideCursor: true,
          format: '[{bar}] {percentage}% | {value}/{total} | {label}',
        },
        cliProgress.Presets.shades_classic
      )
      const accountBalancesBuildingBar = multibar.create(accounts.length, 0, {
        label: 'Building account balances',
      })

      for (const account of accounts) {
        account.useTransaction(trx)
        accountBalances[account.id] = account.balance
        accountBalancesBuildingBar.increment()
      }

      const transactionsBuildingBar = multibar.create(this.amount, 0, {
        label: 'Building transactions',
      })

      for (let i = 0; i < this.amount; i++) {
        const account = faker.helpers.arrayElement(accounts)
        const accountId = account.id

        const type = faker.helpers.arrayElement(Object.values(TransactionType))
        const price = Number(faker.finance.amount({ min: this.minPrice, max: this.maxPrice }))

        accountBalances[accountId] =
          type === TransactionType.Income
            ? accountBalances[accountId] + price
            : accountBalances[accountId] - price

        transactions.push({
          accountId,
          type,
          price,
          balanceAfter: accountBalances[accountId],
        })

        transactionsBuildingBar.increment()
      }

      const creatingTransactionsBar = multibar.create(this.amount / this.chunkSize, 0, {
        label: 'Creating transactions',
      })

      for (let i = 0; i < transactions.length; i += this.chunkSize) {
        await Transaction.createMany(transactions.slice(i, i + this.chunkSize), { client: trx })
        creatingTransactionsBar.increment()
      }

      const updatingAccountBalancesBar = multibar.create(accounts.length, 0, {
        label: 'Updating account balances',
      })

      for (const account of accounts) {
        account.balance = accountBalances[account.id]
        await account.save()
        updatingAccountBalancesBar.increment()
      }

      multibar.stop()
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error(error)
    }
  }
}
