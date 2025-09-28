import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('comments')
export class Comments {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  comment: string;

  @Column()
  pageId: string;

  @Column()
  imageUrl: string;

  @Column()
  createdAt: Date;
}
