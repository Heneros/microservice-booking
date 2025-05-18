import { PrismaClient } from '@prisma/client';

export abstract class AbstractRepositoryPostgres<T> {
  protected abstract readonly prisma: PrismaClient;

  protected abstract readonly model: any;

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findByEmail(criteria: { email: string }): Promise<T | null> {
    return this.model.findUnique({ where: { email: criteria.email } });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: number): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}
