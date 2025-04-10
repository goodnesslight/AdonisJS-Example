import { BaseModel } from '@adonisjs/lucid/orm'
import { ModelAttributes } from '@adonisjs/lucid/types/model'

export abstract class AbstractRepository<M extends typeof BaseModel> {
  constructor(protected readonly model: M) {}

  async update(
    searchPayload: Partial<ModelAttributes<InstanceType<M>>>,
    updatePayload: Partial<ModelAttributes<InstanceType<M>>>
  ): Promise<void> {
    await this.model.updateOrCreate(searchPayload, updatePayload)
  }

  async findOne(id: number): Promise<InstanceType<M> | null> {
    return await this.model.find(id)
  }
}
