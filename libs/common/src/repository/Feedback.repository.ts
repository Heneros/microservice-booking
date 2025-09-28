import { Injectable } from '@nestjs/common';
import { AbstractMongoRepository } from '../mongodb-database/abstract.repository';
import { Comments } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';

@Injectable()
export class FeedbackRepository extends AbstractMongoRepository<Comments> {
  constructor(
    @InjectRepository(Comments)
    protected readonly repository: Repository<Comments>,
  ) {
    super();
  }

  async findById(id: ObjectId | string): Promise<Comments | null> {
    return this.findOne({ id } as any);
  }

  async updateComment(
    id: ObjectId | string,
    data: Partial<Comments>,
  ): Promise<Comments | null> {
    return this.update(id, data);
  }

  async getAllFromPageComments(): Promise<Comments[]> {
    return this.findAll({});
  }

  async findPage(
    filter: Partial<Record<string, any>> = {},
    page = 1,
    pageSize = 20,
    sort: Record<string, 'ASC' | 'DESC' | 1 | -1> = { createdAt: -1 },
  ) {
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.repository.find({
        where: filter,
        skip,
        take: pageSize,
        order: sort as any,
      }),
      this.repository.count({ where: filter }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return { items, total, page, pageSize, totalPages };
  }
}
