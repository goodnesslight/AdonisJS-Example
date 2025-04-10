import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import cliProgress from 'cli-progress'
import db from '@adonisjs/lucid/services/db'
import Account from '#models/account'

export default class extends BaseSeeder {
  private readonly amount: number = 100

  private readonly minNameLength: number = 0
  private readonly maxNameLength: number = 20

  private readonly minBalance: number = 10_000_000
  private readonly maxBalance: number = 20_000_000

  async run() {
    const trx = await db.transaction()

    try {
      const accounts: Partial<Account>[] = []
      const accountsBuildingBar: cliProgress.SingleBar = new cliProgress.SingleBar(
        {
          clearOnComplete: false,
          hideCursor: true,
          format: '[{bar}] {percentage}% | {value}/{total} | Building accounts',
        },
        cliProgress.Presets.shades_classic
      )
      accountsBuildingBar.start(this.amount, 0)

      for (let i = 0; i < this.amount; i++) {
        accounts.push({
          name: faker.person.middleName().slice(this.minNameLength, this.maxNameLength),
          balance: Number(
            faker.finance.amount({
              min: this.minBalance,
              max: this.maxBalance,
            })
          ),
        })
        accountsBuildingBar.increment()
      }

      accountsBuildingBar.stop()
      await Account.createMany(accounts, { client: trx })
      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error(error)
    }
  }
}
