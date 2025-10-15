import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export abstract class AbstractMongoRepository<T> {
  protected abstract readonly repository: Repository<T>;

  async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }
  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find({ where });
  }

  async create(entityData: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(entityData);
    return this.repository.save(entity);
  }

  async update(id, entityData): Promise<T | null> {
    await this.repository.update(id, entityData);
    return this.findOne({ id } as FindOptionsWhere<T>);
  }

  async delete(where: FindOptionsWhere<T>): Promise<boolean> {
    const res = await this.repository.delete(where);
    return res.affected > 0;
  }

  async findAll(
    filter: Partial<Record<string, any>> = {},
    options: { skip?: number; take?: number; sort?: any } = {},
  ) {
    const cursor = this.repository.find({
      where: filter,
      skip: options.skip,
      take: options.take,
      order: options.sort,
    });
    return cursor;
    // return this.findAll({});
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    entityData: DeepPartial<T>,
  ): Promise<T | null> {
    const entity = await this.findOne(where);
    if (!entity) return null;

    Object.assign(entity, entityData);
    return this.repository.save(entity);
  }
}
