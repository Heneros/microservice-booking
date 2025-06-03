import { Prisma, PrismaClient } from '@prisma/client';

export abstract class AbstractRepositoryPostgres<T> {
  protected abstract readonly prisma: PrismaClient;

  protected abstract readonly model: any;

  async findFirst(where: any): Promise<T | null> {
    return this.model.findFirst({ where });
  }

  async findUnique(where: any): Promise<T | null> {
    return this.model.findUnique({ where });
  }

  async findMany(params?: {
    where?: any;
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    return this.model.findMany(params);
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(where: any, data: any): Promise<T> {
    return this.model.update({ where, data });
  }

  async delete(where: any): Promise<T> {
    return this.model.delete({ where });
  }
}
