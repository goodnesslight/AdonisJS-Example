import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { TransactionType } from '#common/enums/transaction_type'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Account from '#models/account'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>
  @column()
  declare accountId: number

  @column()
  declare type: TransactionType

  @column()
  declare price: number // decimal

  @column()
  declare balanceAfter: number // decimal

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
