import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Transaction from './transaction.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @column()
  declare name: number

  @column()
  declare balance: number // decimal

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
