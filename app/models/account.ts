import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Transaction from '#models/transaction'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @column()
  declare name: string

  @column({ consume: (value: string) => Number.parseFloat(value) })
  declare balance: number // decimal

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
