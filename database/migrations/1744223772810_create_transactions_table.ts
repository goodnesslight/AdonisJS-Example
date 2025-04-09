import { BaseSchema } from '@adonisjs/lucid/schema'
import { TransactionType } from '@app/common/enums/transaction_type.js'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('account_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')

      table.enu('type', Object.values(TransactionType)).notNullable()
      table.decimal('price', 10, 2)
      table.decimal('balance_after', 10, 2)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
