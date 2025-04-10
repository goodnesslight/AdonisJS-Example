import { AccountRepository } from '#repositories/account_repository'
import { AccountService } from '#services/account_service'
import TransactionRepository from '#repositories/transaction_repository'
import { TransactionService } from '#services/transaction_service'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'app/repositories/account': AccountRepository
    'app/services/account': AccountService

    'app/repositories/transaction': TransactionRepository
    'app/services/transaction': TransactionService
  }
}
